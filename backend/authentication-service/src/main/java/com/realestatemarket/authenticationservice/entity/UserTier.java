package com.realestatemarket.authenticationservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "user_tiers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserTier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "vip_gold_count")
    private Integer vipGoldCount;

    @Column(name = "vip_silver_count")
    private Integer vipSilverCount;

    @Column(name = "regular_count")
    private Integer regularCount;

    @Column(name = "push_count")
    private Integer pushCount;

    @Column(name = "fast_publish")
    private boolean fastPublish;

    @Column(name = "image_copyright")
    private boolean imageCopyright;

    @Column(name = "schedule_post")
    private boolean schedulePost;

    @Column(name = "performance_report")
    private boolean performanceReport;

    @Column(name = "bulk_operation")
    private boolean bulkOperation;

    @JsonIgnore
    @OneToMany(mappedBy = "userTier")
    private Set<User> users;  

    @Column(name = "is_default")
    private boolean isDefault;

    @Override
    public String toString() {
        return "UserTier{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", vipGoldCount=" + vipGoldCount +
                ", vipSilverCount=" + vipSilverCount +
                ", regularCount=" + regularCount +
                ", pushCount=" + pushCount +
                ", fastPublish=" + fastPublish +
                ", imageCopyright=" + imageCopyright +
                ", schedulePost=" + schedulePost +
                ", performanceReport=" + performanceReport +
                ", bulkOperation=" + bulkOperation +
                '}';
    }
}
