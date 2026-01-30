package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "global_metrics")
public class GlobalMetric {
    @Id
    private String id; // MongoDB uses String ID by default usually

    private String label;
    private String value;
    private String icon; // Icon name from Lucide
    private Integer displayOrder;

    public GlobalMetric(String label, String value, String icon, Integer displayOrder) {
        this.label = label;
        this.value = value;
        this.icon = icon;
        this.displayOrder = displayOrder;
    }
}
