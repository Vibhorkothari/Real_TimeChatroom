import React, { useState } from 'react';
import { FiX, FiAward, FiMoreVertical, FiUserCheck, FiUserX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import './MemberList.css';

const MemberList = ({ room, onClose }) => {
  const { user } = useAuthStore();
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberMenu, setShowMemberMenu] = useState(false);

  const isRoomCreator = room?.creator?._id === user?._id;
  const isAdmin = isRoomCreator; // For now, only creator is admin

  const handleRemoveMember = (memberId) => {
    if (window.confirm('Are you sure you want to remove this member from the room?')) {
      try {
        // Here you would typically make an API call to remove the member
        toast.success('Member removed successfully!');
        setShowMemberMenu(false);
        setSelectedMember(null);
      } catch (error) {
        toast.error('Failed to remove member');
      }
    }
  };

  const handlePromoteToAdmin = (memberId) => {
    if (window.confirm('Are you sure you want to promote this member to admin?')) {
      try {
        // Here you would typically make an API call to promote the member
        toast.success('Member promoted to admin!');
        setShowMemberMenu(false);
        setSelectedMember(null);
      } catch (error) {
        toast.error('Failed to promote member');
      }
    }
  };

  const getMemberStatus = (member) => {
    if (member._id === room?.creator?._id) {
      return { text: 'Creator', icon: <FiAward />, color: '#f59e0b' };
    }
    if (member.isOnline) {
      return { text: 'Online', icon: <FiUserCheck />, color: '#10b981' };
    }
    return { text: 'Offline', icon: <FiUserX />, color: '#6b7280' };
  };

  const getMemberInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="member-list-overlay">
      <div className="member-list-modal">
        <div className="member-list-header">
          <h2>Room Members ({room?.members?.length || 0})</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="member-list-content">
          {room?.members?.length > 0 ? (
            <div className="members-grid">
              {room.members.map((member) => {
                const status = getMemberStatus(member);
                const isCurrentUser = member._id === user?._id;
                const canManage = isAdmin && !isCurrentUser && member._id !== room?.creator?._id;

                return (
                  <div key={member._id} className="member-card">
                    <div className="member-avatar">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.username} />
                      ) : (
                        <div className="avatar-placeholder">
                          {getMemberInitials(member.username)}
                        </div>
                      )}
                      <div 
                        className="status-indicator"
                        style={{ backgroundColor: status.color }}
                      />
                    </div>
                    
                    <div className="member-info">
                                             <div className="member-name">
                         {member.username}
                         {member._id === room?.creator?._id && (
                           <span className="creator-badge">
                             <FiAward />
                           </span>
                         )}
                       </div>
                      <div className="member-status" style={{ color: status.color }}>
                        {status.icon} {status.text}
                      </div>
                    </div>

                    {canManage && (
                      <div className="member-actions">
                        <button
                          className="action-btn"
                          onClick={() => {
                            setSelectedMember(member);
                            setShowMemberMenu(!showMemberMenu);
                          }}
                        >
                          <FiMoreVertical />
                        </button>
                        
                        {showMemberMenu && selectedMember?._id === member._id && (
                          <div className="member-menu">
                                                         <button
                               className="menu-item"
                               onClick={() => handlePromoteToAdmin(member._id)}
                             >
                               <FiAward /> Promote to Admin
                             </button>
                            <button
                              className="menu-item danger"
                              onClick={() => handleRemoveMember(member._id)}
                            >
                              <FiUserX /> Remove from Room
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-members">
              <div className="empty-icon">👥</div>
              <h3>No Members</h3>
              <p>This room doesn't have any members yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberList;
