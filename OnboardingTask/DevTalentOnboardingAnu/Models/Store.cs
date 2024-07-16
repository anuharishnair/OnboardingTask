using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DevTalentOnboardingAnu.Models
{
    public class Store
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "The Name field is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "The Address field is required.")]
        public string Address { get; set; }

        [JsonIgnore]
        public ICollection<Sales> ProductSold { get; set; }
    }
}