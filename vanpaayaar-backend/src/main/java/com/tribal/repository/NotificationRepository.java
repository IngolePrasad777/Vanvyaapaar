package com.tribal.repository;

import com.tribal.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Find notifications for a specific user
    List<Notification> findByUserIdAndUserRoleOrderByCreatedAtDesc(Long userId, String userRole);
    
    // Find unread notifications for a user
    List<Notification> findByUserIdAndUserRoleAndIsReadFalseOrderByCreatedAtDesc(Long userId, String userRole);
    
    // Count unread notifications for a user
    Long countByUserIdAndUserRoleAndIsReadFalse(Long userId, String userRole);
    
    // Find notifications by type
    List<Notification> findByUserIdAndUserRoleAndTypeOrderByCreatedAtDesc(Long userId, String userRole, String type);
    
    // Find notifications by priority
    List<Notification> findByUserIdAndUserRoleAndPriorityOrderByCreatedAtDesc(Long userId, String userRole, String priority);
    
    // Mark notification as read
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt WHERE n.id = :id")
    void markAsRead(@Param("id") Long id, @Param("readAt") LocalDateTime readAt);
    
    // Mark all notifications as read for a user
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt WHERE n.userId = :userId AND n.userRole = :userRole AND n.isRead = false")
    void markAllAsRead(@Param("userId") Long userId, @Param("userRole") String userRole, @Param("readAt") LocalDateTime readAt);
    
    // Delete old notifications (older than specified days)
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.createdAt < :cutoffDate")
    void deleteOldNotifications(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    // Find notifications that need email sending
    List<Notification> findByIsEmailSentFalseAndCreatedAtAfter(LocalDateTime after);
}