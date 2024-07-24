using DevTalentOnboardingAnu.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

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
        public async Task<IActionResult> CreateStoreAsync([FromBody] StoreDto storeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var store = new Store
                {
                    Name = storeDto.Name,
                    Address = storeDto.Address,
                    ProductSold = new List<Sales>() // Initialize the navigation property if necessary
                };

                await _context.Stores.AddAsync(store);
                await _context.SaveChangesAsync();

                return Ok("Store Saved Successfully");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred while saving the store: " + ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }

        // Read
        [HttpGet]
        public async Task<ActionResult<List<Store>>> GetStoresAsync()
        {
            try
            {
                var stores = await _context.Stores.OrderByDescending(p => p.Id).ToListAsync();
                return Ok(stores);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Store>> GetStoreByIdAsync([FromRoute] int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid store ID");
            }

            try
            {
                var store = await _context.Stores.FirstOrDefaultAsync(p => p.Id == id);

                if (store == null)
                {
                    return NotFound("Store is not found");
                }

                return Ok(store);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }

        // Update
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStoreAsync([FromRoute] int id, [FromBody] StoreDto storeDto)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid store ID");
            }

            try
            {
                var store = await _context.Stores.FirstOrDefaultAsync(p => p.Id == id);

                if (store == null)
                {
                    return NotFound("Store is not found");
                }

                store.Name = storeDto.Name;
                store.Address = storeDto.Address;

                await _context.SaveChangesAsync();

                return Ok("Store Updated Successfully");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred while updating the store: " + ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }

        // Delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStoreAsync([FromRoute] int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid store ID");
            }

            try
            {
                var store = await _context.Stores.FirstOrDefaultAsync(p => p.Id == id);

                if (store == null)
                {
                    return NotFound("Store is not found");
                }

                _context.Stores.Remove(store);
                await _context.SaveChangesAsync();

                return Ok("Store Deleted Successfully");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred while deleting the store: " + ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }

    }
}
