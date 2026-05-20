package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(name = "stored_files")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoredFile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String filename;
    private String contentType;
    private String groupName;

    @Lob
    @Column(name = "data", columnDefinition = "BYTEA")
    private byte[] data;

    public StoredFile(String filename, String contentType, String groupName, byte[] data) {
        this.filename = filename;
        this.contentType = contentType;
        this.groupName = groupName;
        this.data = data;
    }
}
