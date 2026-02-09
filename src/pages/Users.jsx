import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


/* ================= STATUS BADGE ================= */
function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status ? 'active' : 'inactive'}`}>
      {status ? 'Active' : 'Inactive'}
    </span>
  );
}




/* ================= USERS PAGE ================= */
export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    {
      id: 1,
      first_name: 'travis',
      last_name: 'scott',
      email: 'aima.lawson @exmple.com',
      initials: 'B',
      phone: '0412345678',
      role: { title: 'admin' },
      status: 1, // Assuming 1 for Active
      title: 'admin'
    },

      {
      id: 2,
      first_name: 'Jane',
      last_name: 'cooper',
      email: 'willie.jenning@exmple.com',
      initials: 'L',
      phone: '0412345678',
      role: { title: 'supervisor' },
      status: 0, // Inactive
      title: 'supervisor'
    },
    
      {
      id: 3,
      first_name: 'Ronald',
      last_name: 'Richards',
      email: 'jackson.graham@exmple.com',
      initials: 'T',
      phone: '0412345678',
      role: { title: 'Project Manager' },
      status: 1, // Assuming 1 for DEActive
      title: 'Project Manager'
    },
    {
      id: 4,
      first_name: 'Darlene',
      last_name: 'Richards',
      email: 'nathan,roberts@exmple.com',
      initials: 'P',
      phone: '0412345678',
      role: { title: 'Project Manager' },
      status: 1, // Assuming 1 for Active
      title: 'Project Manager'
    },
    {
      id: 5,
      first_name: 'Courtenet',
      last_name: 'Henry',
      email: 'curtis.weaver@exmple.com',
      initials: 'C',
      phone: '0412345678',
      role: { title: 'Project Manager' },
      status: 1, // Assuming 1 for Active
      title: 'Project Manager'
    },
     {
      id: 6,
      first_name: 'Wade',
      last_name: 'Warren',
      email: 'kenzi.lawson@exmple.com',
      initials: 'B',
      phone: '0412345678',
      role: { title: 'supervisor' },
      status: 1, // Assuming 1 for Active
      title: 'Project Manager'
    },
     {
      id: 7,
      first_name: 'Brookly',
      last_name: 'Simmons',
      email: 'felicia.reid@exmple.com',
      initials: 'S',
      phone: '0412345678',
      role: { title: 'supervisor' },
      status: 0, // Assuming 1 for DEActive
      title: 'Project Manager'
    },
     {
      id: 8,
      first_name: 'Brookly',
      last_name: 'Simmons',
      email: 'felicia.reid@exmple.com',
      initials: 'T',
      phone: '0412345678',
      role: { title: 'supervisor' },
      status: 0, // Assuming 1 for DEActive
      title: 'Project Manager'
    },
     {
      id: 9,
      first_name: 'Jenny',
      last_name: 'Wilson',
      email: 'nevaeh.simmons@exmple.com',
      initials: 'S',
      phone: '0412345678',
      role: { title: 'supervisor' },
      status: 1, // Assuming 1 for Active
      title: 'Project Manager'
    },
     {
      id: 10,
      first_name: 'Robext',
      last_name: 'Fox',
      email: 'sara.cruz@exmple.com',
      initials: 'p',
      phone: '0412345678',
      role: { title: 'supervisor' },
      status: 1, // Assuming 1 for Active
      title: 'Project Manager'
    },
  ]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleLogout = () => {
    localStorage.clear(); // or remove token
    navigate("/login");
  };

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/user${status ? `?status=${status}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            company_id: localStorage.getItem("company_id"),
          },
        }
      );
      setUsers(res.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  }, [status]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status]);

  const toggleStatus = async (user) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/user/${user.id}/status`,
        { status: user.status ? 0 : 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            company_id: localStorage.getItem("company_id"),
          },
        }
      );
      toast.success("Status changed successfully");
      fetchUsers();
    } catch {
      toast.error("Failed to change status");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure want to delete?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            company_id: localStorage.getItem("company_id"),
          },
        }
      );

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const slicedUsers = filteredUsers.slice(startIndex, endIndex);
  const displayedUsers = [...slicedUsers, ...Array(Math.max(0, itemsPerPage - slicedUsers.length)).fill(null)];

  return (
    <div className="app-layout">
      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <div className="logo">LOGO</div>

        <div className="menu-title">MAIN MENU</div>
        <a href="#">Dashboard</a>
        <a href="#" className="active">User Management</a>
        <a href="#">Team</a>

        <div className="menu-title">SETTINGS</div>
        <a href="#">Settings</a>

       <div className="logout" onClick={handleLogout}>
          Logout
        </div>
      
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="main-content">
        {/* TOP HEADER */}
        <div className="header-bar">
          <h1>Jobs Management</h1>

          <div className="header-right">
            <span className="bell">🔔</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="profile-img"
            />
            <button className="add-btn" onClick={() => navigate("/users/add")}>+ Add New User</button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="filter-bar">
          <input
            placeholder="Search by name, email..."
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>S.L</th>
                <th>Name</th>
                <th>Email</th>
                <th>Initials</th>
                <th>Phone Number</th>
                <th>Role</th>
                <th>Status</th>
                <th>Title</th>
               <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {displayedUsers.map((u, i) => (
                <tr key={u ? u.id : `empty-${i}`}>
                  <td>{u ? startIndex + i + 1 : ''}</td>
                  <td>{u ? `${u.first_name} ${u.last_name || ''}` : ''}</td>
                  <td>{u ? u.email : ''}</td>
                  <td>{u ? u.initials || "-" : ''}</td>
                  <td>{u ? u.phone || "-" : ''}</td>
                  <td>{u ? u.role?.title || "-" : ''}</td>
                  <td>
                    {u ? <input type="checkbox" checked={u.status} onChange={() => toggleStatus(u)} style={{ accentColor: 'green' }} /> : ''}
                  </td>
                  <td>{u ? u.title || "-" : ''}</td>
                  <td className="actions">
                    {u ? (
                      <>
                        <button className="btn-edit" onClick={() => navigate(`/users/edit/${u.id}`)}>✏️</button>
                        <button className="btn-delete" onClick={() => deleteUser(u.id)}>🗑️</button>
                      </>
                    ) : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

         
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} results
            </div>

            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={endIndex >= filteredUsers.length}
              >
                Next
              </button>
            </div>
          </div>

        </div>
      </div>

      <style>
        {`
          input[type="checkbox"] {
            appearance: none;
            width: 42px;
            height: 22px;
            background: #d6d6d6;
            border-radius: 50px;
            position: relative;
            cursor: pointer;
          }

          input[type="checkbox"]:checked {
            background: #7b6cff;
          }
        `}
      </style>
    </div>
  );
}
