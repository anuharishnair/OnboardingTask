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
    public class CustomersController : ControllerBase
    {
        private readonly TalentDbContext _context;

        public CustomersController(TalentDbContext context)
        {
            _context = context;
        }
        // Create
        [HttpPost]
        public async Task<IActionResult> CreateCustomerAsync([FromBody] CustomerDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var customer = new Customer
                {
                    Name = request.Name,
                    Address = request.Address,
                    ProductSold = new List<Sales>() // Initialize the navigation property if necessary
                };

                await _context.Customers.AddAsync(customer);
                await _context.SaveChangesAsync();

                return Ok("Customer Saved Successfully");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred while saving the customer: " + ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }

        // Read
        [HttpGet]
        public async Task<ActionResult<List<Customer>>> GetCustomersAsync()
        {
            try
            {
                var customers = await _context.Customers.OrderByDescending(p => p.Id).ToListAsync();
                return Ok(customers);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomerByIdAsync([FromRoute] long id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid customer ID");
            }

            try
            {
                var customer = await _context.Customers.FirstOrDefaultAsync(p => p.Id == id);

                if (customer == null)
                {
                    return NotFound("Customer is not found");
                }

                return Ok(customer);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }

        // Update
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomerAsync([FromRoute] long id, [FromBody] CustomerDto request)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid customer ID");
            }

            try
            {
                var customer = await _context.Customers.FirstOrDefaultAsync(p => p.Id == id);

                if (customer == null)
                {
                    return NotFound("Customer is not found");
                }

                customer.Name = request.Name;
                customer.Address = request.Address;

                await _context.SaveChangesAsync();

                return Ok("Customer Updated Successfully");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred while updating the customer: " + ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }

        // Delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomerAsync([FromRoute] long id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid customer ID");
            }

            try
            {
                var customer = await _context.Customers.FirstOrDefaultAsync(p => p.Id == id);

                if (customer == null)
                {
                    return NotFound("Customer is not found");
                }

                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();

                return Ok("Customer Deleted Successfully");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred while deleting the customer: " + ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }
    }
}
