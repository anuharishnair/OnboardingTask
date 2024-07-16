using System;
using System.ComponentModel.DataAnnotations;

namespace DevTalentOnboardingAnu.Models
{
    public class SalesDto
    {
        [Required(ErrorMessage = "The DateSold field is required.")]
        public DateTime DateSold { get; set; }

        [Required(ErrorMessage = "The Customer field is required.")]
        public int CustomerId { get; set; }

        [Required(ErrorMessage = "The Product field is required.")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "The Store field is required.")]
        public int StoreId { get; set; }
    }
}
