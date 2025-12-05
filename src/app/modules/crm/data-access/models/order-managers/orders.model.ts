import { PaymentsModel } from '@app/modules/crm/data-access/models/order-managers/payments.model';

export class OrdersModel {

  orderId?: number;
  orderNo?: string;
  customerId?: number;
  customerName?: string;
  orderDate?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  orderDetailIds?: number[];
  orderDetails?: OrderDetailsModel[];
  totalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  taxAmount?: number;
  paymentIds?: number[];
  payments?: PaymentsModel[];
}


export class OrderDetailsModel {
  orderDetailId?: number;
  orderId?: number;
  productId?: number;
  quantity?: number;
  discount?: number;
  discountType?: string;
  unitPrice?: number;
  totalPrice?: number;
}


