using System.ComponentModel.DataAnnotations;

namespace DevTalentOnboardingAnu.Models
{
    public class ProductDto
    {
        [Required(ErrorMessage = "The Name field is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "The Price field is required.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "The Price must be greater than 0.")]
        public decimal Price { get; set; }
    }
}
