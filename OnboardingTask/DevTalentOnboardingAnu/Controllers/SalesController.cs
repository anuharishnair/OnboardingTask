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
    public class SalesController : ControllerBase
    {
        private readonly TalentDbContext _context;

        public SalesController(TalentDbContext context)
        {
            _context = context;
        }

        // Create
        [HttpPost]
        public async Task<IActionResult> CreateSalesAsync([FromBody] SalesDto salesDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var sales = new Sales
                {
                    DateSold = salesDto.DateSold,
                    CustomerId = salesDto.CustomerId,
                    ProductId = salesDto.ProductId,
                    StoreId = salesDto.StoreId
                };

                await _context.Sales.AddAsync(sales);
                await _context.SaveChangesAsync();

                return Ok("Sales Saved Successfully");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred while saving the sales: " + ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }

        // Read
        [HttpGet]
        public async Task<ActionResult<List<Sales>>> GetSalesAsync()
        {
            try
            {
                var salesList = await _context.Sales
                    .Include(s => s.Customer)
                    .Include(s => s.Product)
                    .Include(s => s.Store)
                    .OrderByDescending(s => s.Id)
                    .ToListAsync();
                return Ok(salesList);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Sales>> GetSalesByIdAsync([FromRoute] int id)
        {
            try
            {
                var sales = await _context.Sales
                    .Include(s => s.Customer)
                    .Include(s => s.Product)
                    .Include(s => s.Store)
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (sales == null)
                {
                    return NotFound("Sales is not found");
                }

                return Ok(sales);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }

        // Update
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSalesAsync([FromRoute] int id, [FromBody] SalesDto salesDto)
        {
            try
            {
                var sales = await _context.Sales.FirstOrDefaultAsync(s => s.Id == id);

                if (sales == null)
                {
                    return NotFound("Sales is not found");
                }

                sales.DateSold = salesDto.DateSold;
                sales.CustomerId = salesDto.CustomerId;
                sales.ProductId = salesDto.ProductId;
                sales.StoreId = salesDto.StoreId;

                await _context.SaveChangesAsync();

                return Ok("Sales Updated Successfully");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred while updating the sales: " + ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }

        // Delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSalesAsync([FromRoute] int id)
        {
            try
            {
                var sales = await _context.Sales.FirstOrDefaultAsync(s => s.Id == id);

                if (sales == null)
                {
                    return NotFound("Sales is not found");
                }

                _context.Sales.Remove(sales);
                await _context.SaveChangesAsync();

                return Ok("Sales Deleted Successfully");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred while deleting the sales: " + ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }
    }
}
