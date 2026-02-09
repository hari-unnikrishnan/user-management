import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// import "../App.css";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    initials: "",
    role: "",
    responsibilities: [],
    user_picture: null,
  });

  const [roles, setRoles] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    company_id: localStorage.getItem("company_id"),
  };

  /* ================= FETCH USER ================= */
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/user/${id}`, { headers })
      .then((res) => {
        const u = res.data.data;

        setForm({
          name: u.first_name || "",
          email: u.email || "",
          phone: u.phone || "",
          title: u.title || "",
          initials: u.initials || "",
          role: u.role?.id || "",
          responsibilities: u.responsibilities || [],
          user_picture: null,
        });

        if (u.profile_image_url) {
          setPreview(u.profile_image_url);
        }
      });
  }, [id]);

  /* ================= FETCH ROLES ================= */
  useEffect(() => {
    axios
      .post(
        "http://127.0.0.1:8000/api/role/dropdown",
        { type: 0 },
        { headers }
      )
      .then((res) => {
        setRoles(res.data.data.other_roles || []);
      });
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const toggleResponsibility = (value) => {
    setForm((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.includes(value)
        ? prev.responsibilities.filter((r) => r !== value)
        : [...prev.responsibilities, value],
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, user_picture: file });
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = async () => {
    await axios.delete(
      `http://127.0.0.1:8000/api/user/${id}/image`,
      { headers }
    );
    setPreview(null);
    toast.success("Image removed");
  };

  /* ================= SAVE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.role) {
      toast.error("Please fill required fields");
      return;
    }

    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "responsibilities") {
        form.responsibilities.forEach((r) =>
          fd.append("responsibilities[]", r)
        );
      } else if (form[key]) {
        fd.append(key, form[key]);
      }
    });

    fd.append("_method", "put");

    setLoading(true);
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/user/${id}`,
        fd,
        { headers }
      );
      toast.success("User updated successfully");
      navigate("/users");
    } catch {
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Edit User</h2>
          <button onClick={() => navigate("/users")}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* AVATAR */}
          <div className="avatar-upload">
            <div className="avatar">
              {preview ? <img src={preview} alt="profile" /> : "👤"}
            </div>

            <label className="upload-btn">
              📷
              <input type="file" hidden onChange={handleImage} />
            </label>

            {preview && (
              <button
                type="button"
                className="trash-btn"
                onClick={removeImage}
              >
                🗑️
              </button>
            )}
          </div>

          {/* INPUT GRID */}
          <div className="grid">
            <div>
              <label>Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Email *</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Initials</label>
              <input
                name="initials"
                value={form.initials}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Role *</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="">Select your role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DESIGNATION */}
          <div className="checkbox-group">
            <label>Designation</label>
            {[
              "Designer",
              "Project Manager",
              "Production Manager",
              "Sales Rep",
            ].map((r) => (
              <label key={r}>
                <input
                  type="checkbox"
                  checked={form.responsibilities.includes(r)}
                  onChange={() => toggleResponsibility(r)}
                />
                {r}
              </label>
            ))}
          </div>

          <button className="primary-btn" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
