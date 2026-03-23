import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import apiClient from '../config/apiClient';

// ============================================
// PROJECTS HOOKS
// ============================================

export const useGetProjects = (filters = {}) => {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const queryString = new URLSearchParams(filters).toString();
      const response = await apiClient.get(`/api/projects?${queryString}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetProjectById = (projectId) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/projects/${projectId}`);
      return response.data;
    },
    enabled: !!projectId,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData) => {
      const response = await apiClient.post('/api/projects', projectData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = (projectId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData) => {
      const response = await apiClient.put(
        `/api/projects/${projectId}`,
        projectData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });
};

export const useDeleteProject = (projectId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete(`/api/projects/${projectId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// ============================================
// BOOKINGS HOOKS
// ============================================

export const useGetBookings = () => {
  const { admin } = useAuthStore();

  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await apiClient.get('/api/bookings');
      return response.data;
    },
    enabled: !!admin,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData) => {
      const response = await apiClient.post('/api/bookings', bookingData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useUpdateBooking = (bookingId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData) => {
      const response = await apiClient.put(
        `/api/bookings/${bookingId}`,
        bookingData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useDeleteBooking = (bookingId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete(`/api/bookings/${bookingId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

// ============================================
// REVIEWS HOOKS
// ============================================

export const useGetReviews = (filters = {}) => {
  return useQuery({
    queryKey: ['reviews', filters],
    queryFn: async () => {
      const queryString = new URLSearchParams(filters).toString();
      const response = await apiClient.get(`/api/reviews?${queryString}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData) => {
      const response = await apiClient.post('/api/reviews', reviewData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useDeleteReview = (reviewId) => {
  const queryClient = useQueryClient();
  const { admin } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete(`/api/reviews/${reviewId}`);
      return response.data;
    },
    enabled: !!admin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

// ============================================
// INQUIRIES HOOKS
// ============================================

export const useGetInquiries = () => {
  const { admin } = useAuthStore();

  return useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const response = await apiClient.get('/api/inquiries');
      return response.data;
    },
    enabled: !!admin,
  });
};

export const useCreateInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inquiryData) => {
      const response = await apiClient.post('/api/inquiries', inquiryData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
};

export const useDeleteInquiry = (inquiryId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete(`/api/inquiries/${inquiryId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
};

// ============================================
// CONTENT HOOKS
// ============================================

export const useGetSiteContent = () => {
  return useQuery({
    queryKey: ['siteContent'],
    queryFn: async () => {
      const response = await apiClient.get('/api/content');
      return response.data;
    },
    staleTime: 1000 * 60 * 30,
  });
};

export const useUpdateSiteContent = () => {
  const queryClient = useQueryClient();
  const { admin } = useAuthStore();

  return useMutation({
    mutationFn: async (contentData) => {
      const response = await apiClient.put('/api/content', contentData);
      return response.data;
    },
    enabled: !!admin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
    },
  });
};
