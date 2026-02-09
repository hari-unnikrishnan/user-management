import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css";

export default function AddUser() {
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
  const [responsibilities, setResponsibilities] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    company_id: localStorage.getItem("company_id"),
  };

  /* ---------- FETCH ROLES ---------- */
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

  /* ---------- FETCH RESPONSIBILITIES ---------- */
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/user/dropdown-responsibility", { headers })
      .then((res) => {
        setResponsibilities(res.data || []);
      });
  }, []);

  /* ---------- INPUT HANDLER ---------- */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  /* ---------- RESPONSIBILITIES ---------- */
  const toggleResponsibility = (value) => {
    setForm((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.includes(value)
        ? prev.responsibilities.filter((r) => r !== value)
        : [...prev.responsibilities, value],
    }));
  };

  /* ---------- IMAGE ---------- */
  const handleImage = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, user_picture: file });
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setForm({ ...form, user_picture: null });
    setPreview(null);
  };

  /* ---------- SAVE ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.role || form.responsibilities.length === 0) {
      toast.error("Please fill all required fields");
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

    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/user", fd, { headers });
      toast.success("User added successfully");
      navigate("/users");
    } catch {
      toast.error("Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Add New User</h2>
          <button onClick={() => navigate("/users")}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* IMAGE */}
          <div className="avatar-upload">
            <div className="avatar">
              {preview ? <img src={preview} alt="preview" /> : "👤"}
            </div>
            <label className="upload-btn">
              📷
              <input type="file" hidden onChange={handleImage} />
            </label>
            {preview && (
              <button type="button" className="trash-btn" onClick={removeImage}>
                🗑️
              </button>
            )}
          </div>

          {/* INPUT GRID */}
          <div className="grid">
            <div>
              <label>Name *</label>
              <input name="name" placeholder="Enter your name" onChange={handleChange} />
            </div>

            <div>
              <label>Email *</label>
              <input name="email" placeholder="Enter your email" onChange={handleChange} />
            </div>

            <div>
              <label>Phone Number</label>
              <input name="phone" placeholder="Enter your phone number" onChange={handleChange} />
            </div>

            <div>
              <label>Title</label>
              <input name="title" placeholder="Enter your title" onChange={handleChange} />
            </div>

            <div>
              <label>Initials</label>
              <input name="initials" placeholder="Enter your initials" onChange={handleChange} />
            </div>

            <div>
              <label>Role *</label>
              <select name="role" onChange={handleChange}>
                <option value="">Select your role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* RESPONSIBILITIES */}
          <div className="checkbox-group">
            <label>Designation *</label>
            {["Designer", "Project Manager", "Production Manager", "Sales Rep"].map(
              (r) => (
                <label key={r}>
                  <input
                    type="checkbox"
                    onChange={() => toggleResponsibility(r)}
                  />
                  {r}
                </label>
              )
            )}
          </div>

          {/* BUTTON */}
          <button className="primary-btn" disabled={loading}>
            {loading ? "Saving..." : "Add New User"}
          </button>
        </form>
      </div>
    </div>
  );
}
