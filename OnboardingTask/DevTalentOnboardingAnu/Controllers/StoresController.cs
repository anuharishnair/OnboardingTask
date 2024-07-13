using DevTalentOnboardingAnu.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DevTalentOnboardingAnu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoresController : ControllerBase
    {
        private readonly TalentDbContext _context;
        public StoresController(TalentDbContext context)
        {
            _context = context;
        }

        // Create
        [HttpPost]
        public async Task<IActionResult> CreateStore([FromBody] Store store)
        {
            await _context.Stores.AddAsync(store);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Store Saved Successfully" });
        }

        // Read
        [HttpGet]
        public async Task<ActionResult<List<Store>>> GetStores()
        {
            var stores = await _context.Stores.OrderByDescending(s => s.Id).ToListAsync();
            return Ok(stores);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Store>> GetStoreById([FromRoute] long id)
        {
            var store = await _context.Stores.FirstOrDefaultAsync(s => s.Id == id);

            if (store == null)
            {
                return NotFound("Store is not found");
            }

            return Ok(store);
        }

        // Update
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStore([FromRoute] long id, [FromBody] Store updatedStore)
        {
            var store = await _context.Stores.FirstOrDefaultAsync(p => p.Id == id);

            if (store == null)
            {
                return NotFound("Store is not found");
            }

            store.Name = updatedStore.Name;
            store.Address = updatedStore.Address;

            await _context.SaveChangesAsync();

            return Ok("Store Updated Successfully");
        }

        // Delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStore([FromRoute] long id)
        {
            var store = await _context.Stores.FirstOrDefaultAsync(s => s.Id == id);

            if (store == null)
            {
                return NotFound("Store is not found");
            }

            _context.Stores.Remove(store);
            await _context.SaveChangesAsync();

            return Ok("Store Deleted Successfully");
        }
    }
}
