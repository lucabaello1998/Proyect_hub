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
            if (log.Revoked) return BadRequest(new { message = "Ya fue revocada" });
            log.Revoked = true;
            log.RevokedAt = DateTime.UtcNow;
            log.RevokedBy = int.TryParse(User.FindFirstValue("userId"), out var uid) ? uid : (int?)null;
            await _context.SaveChangesAsync();
            return Ok(log);
        }
    }
}
