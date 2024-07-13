using DevTalentOnboardingAnu.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<IActionResult> CreateCustomer([FromBody] Customer customer)
        {
            await _context.Customers.AddAsync(customer);
            await _context.SaveChangesAsync();

            return Ok("Customer Saved Successfully");
        }

        // Read
        [HttpGet]
        public async Task<ActionResult<List<Customer>>> GetCustomers()
        {
            var customers = await _context.Customers.OrderByDescending(p => p.Id).ToListAsync();

            return Ok(customers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomerById([FromRoute] long id)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(p => p.Id == id);

            if (customer is null)
            {
                return NotFound("Customer is not found");
            }

            return Ok(customer);
        }

        // Update
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer([FromRoute] long id, [FromBody] Customer updatedCustomer)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(p => p.Id == id);

            if (customer is null)
            {
                return NotFound("Customer is not found");
            }

            customer.Name = updatedCustomer.Name;
            customer.Address = updatedCustomer.Address;

            await _context.SaveChangesAsync();

            return Ok("Customer Updated Successfully");
        }

        // Delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer([FromRoute] long id)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(p => p.Id == id);

            if (customer is null)
            {
                return NotFound("Customer is not found");
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return Ok("Customer Deleted Successfully");
        }
    }
}
