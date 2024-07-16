using System.ComponentModel.DataAnnotations;

namespace DevTalentOnboardingAnu.Models
{
    public class StoreDto
    {
        [Required(ErrorMessage = "The Name field is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "The Address field is required.")]
        public string Address { get; set; }
    }
}
