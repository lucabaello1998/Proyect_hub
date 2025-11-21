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
    }
}
