import api from '../lib/api';

export interface DeliveryAgent {
  id: number;
  name: string;
  phone: string;
  email: string;
  currentPincode: string;
  vehicleType: string;
  vehicleNumber: string;
  serviceablePincodes: string;
  status: 'FREE' | 'ASSIGNED' | 'BUSY' | 'OFFLINE';
  isOnline: boolean;
  currentWorkload: number;
  totalDeliveries: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  lastActiveTime: string;
}

export interface Delivery {
  id: number;
  trackingId: string;
  order: {
    id: number;
    buyer: { name: string; phone: string };
    seller: { name: string; phone: string };
    totalAmount: number;
  };
  agent?: DeliveryAgent;
  status: 'CREATED' | 'ASSIGNED' | 'ACCEPTED_BY_AGENT' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  pickupAddress: string;
  pickupPincode: string;
  deliveryAddress: string;
  deliveryPincode: string;
  buyerName: string;
  buyerPhone: string;
  sellerName: string;
  sellerPhone: string;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  agentNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryAnalytics {
  totalDeliveries: number;
  activeDeliveries: number;
  completedDeliveries: number;
  failedDeliveries: number;
  totalAgents: number;
  onlineAgents: number;
  availableAgents: number;
  averageDeliveryTimeHours: number;
  weeklySuccessRate: number;
}

class DeliveryService {
  // Tracking
  async trackDelivery(trackingId: string): Promise<Delivery> {
    try {
      const response = await api.get(`/delivery/track/${trackingId}`);
      return response.data;
    } catch (error) {
      // Return mock data if backend is not ready
      return this.getMockDelivery(trackingId);
    }
  }

  async getDeliveriesForBuyer(buyerId: number): Promise<Delivery[]> {
    try {
      const response = await api.get(`/delivery/buyer/${buyerId}`);
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async getDeliveriesForSeller(sellerId: number): Promise<Delivery[]> {
    try {
      const response = await api.get(`/delivery/seller/${sellerId}`);
      return response.data;
    } catch (error) {
      return [];
    }
  }

  // Agent Management
  async getAvailableAgents(pincode: string): Promise<DeliveryAgent[]> {
    try {
      const response = await api.get(`/delivery/agents/available/${pincode}`);
      return response.data;
    } catch (error) {
      return this.getMockAgents();
    }
  }

  async getAgentPerformance(agentId: number): Promise<any> {
    try {
      const response = await api.get(`/delivery/agents/${agentId}/performance`);
      return response.data;
    } catch (error) {
      return {};
    }
  }

  async toggleAgentStatus(agentId: number): Promise<boolean> {
    try {
      const response = await api.post(`/delivery/agents/${agentId}/toggle-status`);
      return response.data;
    } catch (error) {
      return true; // Mock success
    }
  }

  // Admin Functions
  async getAllDeliveries(): Promise<Delivery[]> {
    try {
      const response = await api.get('/admin/delivery/all');
      return response.data;
    } catch (error) {
      return this.getMockDeliveries();
    }
  }

  async getActiveDeliveries(): Promise<Delivery[]> {
    try {
      const response = await api.get('/admin/delivery/active');
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async getDeliveryAnalytics(): Promise<DeliveryAnalytics> {
    try {
      const response = await api.get('/admin/delivery/analytics');
      return response.data;
    } catch (error) {
      return this.getMockAnalytics();
    }
  }

  async reassignDelivery(deliveryId: number, newAgentId: number): Promise<boolean> {
    try {
      const response = await api.post(`/admin/delivery/${deliveryId}/reassign/${newAgentId}`);
      return response.data;
    } catch (error) {
      return true; // Mock success
    }
  }

  async updateDeliveryStatus(deliveryId: number, status: string, notes?: string): Promise<boolean> {
    try {
      const response = await api.post(`/admin/delivery/${deliveryId}/status`, {
        status,
        notes
      });
      return response.data;
    } catch (error) {
      return true; // Mock success
    }
  }

  // Serviceability
  async checkPincodeServiceability(pincode: string): Promise<boolean> {
    try {
      const response = await api.get(`/delivery/serviceable/${pincode}`);
      return response.data;
    } catch (error) {
      return true; // Mock serviceable
    }
  }

  async getDeliveryCharge(pincode: string, deliveryType: string = 'STANDARD'): Promise<number> {
    try {
      const response = await api.get(`/delivery/charge/${pincode}/${deliveryType}`);
      return response.data;
    } catch (error) {
      return deliveryType === 'EXPRESS' ? 100 : 50; // Mock charges
    }
  }

  async getEstimatedDeliveryDays(pincode: string, deliveryType: string = 'STANDARD'): Promise<number> {
    try {
      const response = await api.get(`/delivery/estimate/${pincode}/${deliveryType}`);
      return response.data;
    } catch (error) {
      return deliveryType === 'EXPRESS' ? 1 : 3; // Mock days
    }
  }

  // Agent Dashboard
  async getAgentDeliveries(agentId: number): Promise<Delivery[]> {
    try {
      const response = await api.get(`/delivery/agent/${agentId}/deliveries`);
      return response.data;
    } catch (error) {
      return this.getMockAgentDeliveries();
    }
  }

  async acceptDelivery(deliveryId: number, agentId: number): Promise<boolean> {
    try {
      const response = await api.post(`/delivery/${deliveryId}/accept/${agentId}`);
      return response.data;
    } catch (error) {
      return true; // Mock success
    }
  }

  // Mock data methods
  private getMockDelivery(trackingId: string): Delivery {
    return {
      id: 1,
      trackingId: trackingId,
      order: {
        id: 1,
        buyer: { name: 'John Doe', phone: '9876543210' },
        seller: { name: 'Artisan Shop', phone: '9876543211' },
        totalAmount: 1500
      },
      agent: {
        id: 1,
        name: 'Rajesh Kumar',
        phone: '9876543212',
        email: 'rajesh@example.com',
        currentPincode: '400001',
        vehicleType: 'BIKE',
        vehicleNumber: 'MH-01-AB-1234',
        serviceablePincodes: '400001,400002',
        status: 'BUSY',
        isOnline: true,
        currentWorkload: 2,
        totalDeliveries: 45,
        rating: 4.7,
        createdAt: '2024-01-01T00:00:00',
        updatedAt: new Date().toISOString(),
        lastActiveTime: new Date().toISOString()
      },
      status: 'IN_TRANSIT',
      pickupAddress: '123 Seller Street, Mumbai',
      pickupPincode: '400001',
      deliveryAddress: '456 Buyer Avenue, Mumbai',
      deliveryPincode: '400002',
      buyerName: 'John Doe',
      buyerPhone: '9876543210',
      sellerName: 'Artisan Shop',
      sellerPhone: '9876543211',
      estimatedDeliveryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private getMockDeliveries(): Delivery[] {
    return [
      this.getMockDelivery('VV-DEL-000001'),
      this.getMockDelivery('VV-DEL-000002')
    ];
  }

  private getMockAgents(): DeliveryAgent[] {
    return [
      {
        id: 1,
        name: 'Rajesh Kumar',
        phone: '9876543210',
        email: 'rajesh@example.com',
        currentPincode: '400001',
        vehicleType: 'BIKE',
        vehicleNumber: 'MH-01-AB-1234',
        serviceablePincodes: '400001,400002',
        status: 'FREE',
        isOnline: true,
        currentWorkload: 0,
        totalDeliveries: 45,
        rating: 4.7,
        createdAt: '2024-01-01T00:00:00',
        updatedAt: new Date().toISOString(),
        lastActiveTime: new Date().toISOString()
      }
    ];
  }

  private getMockAgentDeliveries(): Delivery[] {
    return [
      {
        ...this.getMockDelivery('VV-DEL-000001'),
        status: 'ASSIGNED'
      }
    ];
  }

  private getMockAnalytics(): DeliveryAnalytics {
    return {
      totalDeliveries: 150,
      activeDeliveries: 12,
      completedDeliveries: 135,
      failedDeliveries: 3,
      totalAgents: 11,
      onlineAgents: 8,
      availableAgents: 5,
      averageDeliveryTimeHours: 24.5,
      weeklySuccessRate: 95.2
    };
  }

  // Utility functions
  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'CREATED': '#9E9E9E',
      'ASSIGNED': '#FF9800',
      'ACCEPTED_BY_AGENT': '#2196F3',
      'PICKED_UP': '#3F51B5',
      'IN_TRANSIT': '#9C27B0',
      'OUT_FOR_DELIVERY': '#FF5722',
      'DELIVERED': '#4CAF50',
      'COMPLETED': '#4CAF50',
      'FAILED': '#F44336',
      'CANCELLED': '#607D8B'
    };
    return statusColors[status] || '#9E9E9E';
  }

  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'CREATED': 'Order Created',
      'ASSIGNED': 'Agent Assigned',
      'ACCEPTED_BY_AGENT': 'Agent Accepted',
      'PICKED_UP': 'Picked Up',
      'IN_TRANSIT': 'In Transit',
      'OUT_FOR_DELIVERY': 'Out for Delivery',
      'DELIVERED': 'Delivered',
      'COMPLETED': 'Completed',
      'FAILED': 'Failed',
      'CANCELLED': 'Cancelled'
    };
    return statusTexts[status] || status;
  }

  getProgressPercentage(status: string): number {
    const progressMap: { [key: string]: number } = {
      'CREATED': 10,
      'ASSIGNED': 20,
      'ACCEPTED_BY_AGENT': 30,
      'PICKED_UP': 50,
      'IN_TRANSIT': 70,
      'OUT_FOR_DELIVERY': 85,
      'DELIVERED': 100,
      'COMPLETED': 100,
      'FAILED': 0,
      'CANCELLED': 0
    };
    return progressMap[status] || 0;
  }
}

export default new DeliveryService();