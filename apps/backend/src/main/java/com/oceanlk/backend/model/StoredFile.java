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

    // NOTE: no @Lob here. On PostgreSQL, @Lob on a byte[] makes Hibernate 6
    // store the bytes as a large object and bind its OID (a bigint), which
    // clashes with the BYTEA column below:
    //   ERROR: column "data" is of type bytea but expression is of type bigint
    // Plain byte[] + BYTEA stores the bytes inline, which is what we want.
    @Column(name = "data", columnDefinition = "BYTEA")
    private byte[] data;

    public StoredFile(String filename, String contentType, String groupName, byte[] data) {
        this.filename = filename;
        this.contentType = contentType;
        this.groupName = groupName;
        this.data = data;
    }
}
