﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DevTalentOnboardingAnu.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "The Name field is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "The Price field is required.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "The Price must be greater than 0.")]
        public decimal Price { get; set; }

        [JsonIgnore]
        public ICollection<Sales> ProductSold { get; set; }
    }
}
