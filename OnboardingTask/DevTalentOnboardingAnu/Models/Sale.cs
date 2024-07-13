using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DevTalentOnboardingAnu.Models
{
    public class Sale
    {
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        public int StoreId { get; set; }

        [Required]
        public DateTime DateSold { get; set; }

        [ForeignKey("ProductId")]
        [JsonIgnore]
        public Product Product { get; set; }

        [ForeignKey("CustomerId")]
        [JsonIgnore]
        public Customer Customer { get; set; }

        [ForeignKey("StoreId")]
        [JsonIgnore]
        public Store Store { get; set; }
    }
}
