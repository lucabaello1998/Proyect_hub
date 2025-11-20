using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectHub.Data;
using ProyectHub.Models;
using System.Security.Claims;

namespace ProyectHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AuditController : ControllerBase
    {
        private readonly ProyectHubDbContext _context;

        public AuditController(ProyectHubDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var logs = await _context.AuditLogs.OrderByDescending(a => a.Timestamp).ToListAsync();
            return Ok(logs);
        }

        // GET: api/audit/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var log = await _context.AuditLogs.FindAsync(id);
            if (log == null) return NotFound();
            return Ok(log);
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] AuditLog log)
        {
            log.Timestamp = DateTime.UtcNow;
            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
            return Ok(log);
        }

        [HttpPost("revoke/{id}")]
        public async Task<IActionResult> Revoke(int id)
        {
            var log = await _context.AuditLogs.FindAsync(id);
            if (log == null) return NotFound();
            if (log.RestoredAt != null) return BadRequest(new { message = "Ya fue restaurada" });

            // Restaurar proyecto borrado
            if (log.Action == "delete" && log.Entity == "Project" && log.EntityId.HasValue)
            {
                if (!string.IsNullOrEmpty(log.Data))
                {
                    try
                    {
                        var restored = System.Text.Json.JsonSerializer.Deserialize<Project>(log.Data);
                        if (restored != null)
                        {
                            restored.Id = 0;
                            _context.Projects.Add(restored);
                            await _context.SaveChangesAsync();
                        }
                    }
                    catch { }
                }
            }
            // Revocar creación: eliminar el proyecto y sus imágenes
            else if (log.Action == "create" && log.Entity == "Project" && log.EntityId.HasValue)
            {
                var projectCreate = await _context.Projects.FindAsync(log.EntityId.Value);
                if (projectCreate != null)
                {
                    if (!string.IsNullOrEmpty(projectCreate.Images))
                    {
                        try
                        {
                            var imageList = new List<string>();
                            if (projectCreate.Images.StartsWith("["))
                                imageList = System.Text.Json.JsonSerializer.Deserialize<List<string>>(projectCreate.Images) ?? new List<string>();
                            else
                                imageList.Add(projectCreate.Images);
                            foreach (var imageUrl in imageList)
                            {
                                if (imageUrl.Contains("/images/"))
                                {
                                    var fileName = imageUrl.Split("/images/").Last();
                                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);
                                    if (System.IO.File.Exists(filePath))
                                        System.IO.File.Delete(filePath);
                                }
                            }
                        }
                        catch { }
                    }
                    _context.Projects.Remove(projectCreate);
                    await _context.SaveChangesAsync();
                }
            }

            // Marcar log como restaurado
            log.RestoredAt = DateTime.UtcNow;
            log.RevokedBy = int.TryParse(User.FindFirstValue("userId"), out var uid) ? uid : (int?)null;
            await _context.SaveChangesAsync();
            return Ok(log);
        }
    }
}
