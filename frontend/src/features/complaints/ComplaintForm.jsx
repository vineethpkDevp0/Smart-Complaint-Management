import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  MenuItem,
  Select as MuiSelect,
  FormControl,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import FormField from '../../components/forms/FormField';
import complaintService from './complaintService';
import useAuth from '../../hooks/useAuth';
import { validateComplaintForm } from '../../utils/validation';
import { STATUS, STATUS_OPTIONS } from '../../utils/constants';

export const ComplaintForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: STATUS.PENDING,
  });

  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (id) {
      const loadComplaint = async () => {
        try {
          setFetching(true);
          const res = await complaintService.getComplaintById(id);
          const data = res.data;
          setFormData({
            title: data.title || '',
            description: data.description || '',
            status: data.status || STATUS.PENDING,
          });
          if (data.attachments) {
            setFiles(data.attachments);
          }
        } catch (err) {
          console.error(err);
          setServerError('Failed to fetch complaint details.');
        } finally {
          setFetching(false);
        }
      };
      loadComplaint();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files || []);
    if (uploaded.length > 0) {
      const newFiles = uploaded.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateComplaintForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setLoading(true);
      setServerError('');

      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        attachments: files,
      };

      if (isEditing) {
        await complaintService.updateComplaint(id, payload);
        if (isAdmin && formData.status) {
          await complaintService.updateComplaintStatus(id, formData.status);
        }
      } else {
        await complaintService.createComplaint(payload);
      }

      navigate('/complaints');
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to save complaint. Please try again.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="#0f172a">
          {isEditing ? 'Edit Complaint' : 'Create Complaint'}
        </Typography>
        <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
          {isEditing ? 'Update complaint details' : 'Submit a new complaint'}
        </Typography>
      </Box>

      {serverError && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {serverError}
        </Alert>
      )}

      {/* Form Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3.5,
          border: '1px solid #e2e8f0',
          p: { xs: 2.5, sm: 4 },
          bgcolor: '#ffffff',
        }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <FormField label="Title *" required error={errors.title}>
            <Input
              name="title"
              placeholder="Enter complaint title"
              value={formData.title}
              onChange={handleChange}
              error={Boolean(errors.title)}
              disabled={loading || fetching}
              size="small"
            />
          </FormField>

          {/* Description */}
          <FormField label="Description *" required error={errors.description}>
            <Input
              name="description"
              placeholder="Describe your issue in detail..."
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              error={Boolean(errors.description)}
              disabled={loading || fetching}
            />
          </FormField>

          {/* Status (Editable for Admin, or shows current for User) */}
          <FormField label="Status">
            <FormControl fullWidth size="small">
              <MuiSelect
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={!isAdmin && isEditing}
                sx={{ borderRadius: 2 }}
              >
                {STATUS_OPTIONS.map((st) => (
                  <MenuItem key={st} value={st}>
                    {st}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </FormField>

          {/* Drag & Drop File Upload Area */}
          <Box sx={{ mb: 3 }}>
            <Box
              component="label"
              sx={{
                border: '2px dashed #cbd5e1',
                borderRadius: 3,
                bgcolor: '#f8fafc',
                p: 3.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': {
                  borderColor: '#1d68f6',
                  bgcolor: '#f1f5f9',
                },
              }}
            >
              <input
                type="file"
                multiple
                hidden
                onChange={handleFileUpload}
              />
              <AttachFileOutlinedIcon sx={{ color: '#64748b', fontSize: 32, mb: 1, transform: 'rotate(45deg)' }} />
              <Typography variant="body2" color="#64748b" fontWeight={600}>
                Drag & drop files here or <span style={{ color: '#1d68f6' }}>click to upload</span>
              </Typography>
            </Box>

            {/* Selected files preview */}
            {files.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                {files.map((file, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.5,
                      py: 0.5,
                      bgcolor: '#e2e8f0',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="caption" fontWeight={600} color="#0f172a">
                      {file.name}
                    </Typography>
                    <CloseIcon
                      fontSize="small"
                      sx={{ cursor: 'pointer', fontSize: 16, color: '#64748b' }}
                      onClick={() => handleRemoveFile(idx)}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Form Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate('/complaints')}
              disabled={loading}
              sx={{
                borderRadius: 2.5,
                px: 3,
                fontWeight: 600,
                color: '#64748b',
                borderColor: '#cbd5e1',
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              loading={loading}
              sx={{
                borderRadius: 2.5,
                px: 3.5,
                bgcolor: '#1d68f6',
                '&:hover': { bgcolor: '#1a5bd8' },
                fontWeight: 700,
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ComplaintForm;
