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
    public class ProductsController : ControllerBase
    {
        private readonly TalentDbContext _context;

        public ProductsController(TalentDbContext context)
        {
            _context = context;
        }

        // Create
        [HttpPost]
        public async Task<IActionResult> CreateProductAsync([FromBody] ProductDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var product = new Product
                {
                    Name = request.Name,
                    Price = request.Price,
                    ProductSold = new List<Sales>() // Initialize the navigation property if necessary
                };

                await _context.Products.AddAsync(product);
                await _context.SaveChangesAsync();

                return Ok("Product Saved Successfully");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred while saving the product: " + ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }

        // Read
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProductsAsync()
        {
            try
            {
                var products = await _context.Products.OrderByDescending(p => p.Id).ToListAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductByIdAsync([FromRoute] int id)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                {
                    return NotFound("Product is not found");
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }

        // Update
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductAsync([FromRoute] int id, [FromBody] ProductDto request)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                {
                    return NotFound("Product is not found");
                }

                product.Name = request.Name;
                product.Price = request.Price;

                await _context.SaveChangesAsync();

                return Ok("Product Updated Successfully");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred while updating the product: " + ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }

        // Delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductAsync([FromRoute] int id)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                {
                    return NotFound("Product is not found");
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return Ok("Product Deleted Successfully");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred while deleting the product: " + ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "An error occurred: " + ex.Message);
            }
        }
    }
}
