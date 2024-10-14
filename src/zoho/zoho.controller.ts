

import { Controller, Get, Post, Put, Delete, Query, Param, Res, Redirect } from '@nestjs/common';
import { Response } from 'express';
import * as dotenv from 'dotenv';
// Importing `ZohoBooks` correctly based on the export pattern
const ZohoBooks = require('zoho-books'); // Adjust if needed based on actual export

dotenv.config();

@Controller('zoho')
export class ZohoBooksController {
  private zohoBooks: any;
  private organizationId: string = process.env.ZOHO_ORGANIZATION_ID;
  private authToken: string = '';

  // Step 1: Redirect to Zoho authorization URL
  @Get('auth')
  @Redirect()
  getAuthUrl() {
    const authUrl = `https://accounts.zoho.in/oauth/v2/auth?scope=${process.env.ZOHO_SCOPES}&client_id=${process.env.ZOHO_CLIENT_ID}&response_type=code&redirect_uri=${process.env.ZOHO_REDIRECT_URI}`;
    return { url: authUrl };
  }

  // Step 2: Handle the callback and exchange code for access token
  @Get('callback')
  async authCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const tokens = await this.exchangeCodeForTokens(code);
      this.authToken = tokens.access_token;
      await this.initializeZohoBooks(); // Initialize ZohoBooks with the access token

      // Redirect or respond with a success message
      res.json({ message: 'Authorization successful', access_token: this.authToken });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Function to exchange authorization code for access token
  private async exchangeCodeForTokens(code: string): Promise<any> {
    const response = await fetch('https://accounts.zoho.in/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        redirect_uri: process.env.ZOHO_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error_description || 'Failed to exchange code for tokens');
    }
    return data;
  }

  // Function to initialize ZohoBooks with the access token
  private async initializeZohoBooks() {
    try {
      this.zohoBooks = new ZohoBooks({
        authtoken: this.authToken,
        host: process.env.ZOHO_API_URL,
        organization: this.organizationId,
      });
      console.log('ZohoBooks initialized successfully');
    } catch (error) {
      console.error('Error initializing ZohoBooks:', error.message);
    }
  }



  // CRUD Operations for Contacts (Customers and Vendors)
  @Get('contacts')
  async getContacts(@Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/contacts', 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('contacts')
  async createContact(@Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/contacts', 'POST', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('contacts/:id')
  async getContact(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/contacts/${id}`, 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Put('contacts/:id')
  async updateContact(@Param('id') id: string, @Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/contacts/${id}`, 'PUT', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Delete('contacts/:id')
  async deleteContact(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/contacts/${id}`, 'DELETE');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CRUD Operations for Estimates
  @Get('estimates')
  async getEstimates(@Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/estimates', 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('estimates')
  async createEstimate(@Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/estimates', 'POST', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('estimates/:id')
  async getEstimate(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/estimates/${id}`, 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Put('estimates/:id')
  async updateEstimate(@Param('id') id: string, @Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/estimates/${id}`, 'PUT', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Delete('estimates/:id')
  async deleteEstimate(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/estimates/${id}`, 'DELETE');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CRUD Operations for Invoices
  @Get('invoices')
  async getInvoices(@Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/invoices', 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('invoices')
  async createInvoice(@Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/invoices', 'POST', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('invoices/:id')
  async getInvoice(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/invoices/${id}`, 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Put('invoices/:id')
  async updateInvoice(@Param('id') id: string, @Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/invoices/${id}`, 'PUT', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Delete('invoices/:id')
  async deleteInvoice(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/invoices/${id}`, 'DELETE');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CRUD Operations for Customer Payments
  @Get('customer-payments')
  async getCustomerPayments(@Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/customerpayments', 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('customer-payments')
  async createCustomerPayment(@Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/customerpayments', 'POST', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('customer-payments/:id')
  async getCustomerPayment(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/customerpayments/${id}`, 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Put('customer-payments/:id')
  async updateCustomerPayment(@Param('id') id: string, @Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/customerpayments/${id}`, 'PUT', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Delete('customer-payments/:id')
  async deleteCustomerPayment(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/customerpayments/${id}`, 'DELETE');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CRUD Operations for Credit Notes
  @Get('credit-notes')
  async getCreditNotes(@Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/creditnotes', 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('credit-notes')
  async createCreditNote(@Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/creditnotes', 'POST', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('credit-notes/:id')
  async getCreditNote(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/creditnotes/${id}`, 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Put('credit-notes/:id')
  async updateCreditNote(@Param('id') id: string, @Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/creditnotes/${id}`, 'PUT', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Delete('credit-notes/:id')
  async deleteCreditNote(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/creditnotes/${id}`, 'DELETE');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CRUD Operations for Projects
  @Get('projects')
  async getProjects(@Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/projects', 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('projects')
  async createProject(@Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/projects', 'POST', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('projects/:id')
  async getProject(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/projects/${id}`, 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Put('projects/:id')
  async updateProject(@Param('id') id: string, @Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/projects/${id}`, 'PUT', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Delete('projects/:id')
  async deleteProject(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/projects/${id}`, 'DELETE');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CRUD Operations for Expenses
  @Get('expenses')
  async getExpenses(@Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/expenses', 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('expenses')
  async createExpense(@Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/expenses', 'POST', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('expenses/:id')
  async getExpense(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/expenses/${id}`, 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Put('expenses/:id')
  async updateExpense(@Param('id') id: string, @Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/expenses/${id}`, 'PUT', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Delete('expenses/:id')
  async deleteExpense(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/expenses/${id}`, 'DELETE');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CRUD Operations for Sales Orders
  @Get('sales-orders')
  async getSalesOrders(@Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/salesorders', 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('sales-orders')
  async createSalesOrder(@Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/salesorders', 'POST', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('sales-orders/:id')
  async getSalesOrder(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/salesorders/${id}`, 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Put('sales-orders/:id')
  async updateSalesOrder(@Param('id') id: string, @Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/salesorders/${id}`, 'PUT', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Delete('sales-orders/:id')
  async deleteSalesOrder(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/salesorders/${id}`, 'DELETE');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CRUD Operations for Purchase Orders
  @Get('purchase-orders')
  async getPurchaseOrders(@Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/purchaseorders', 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('purchase-orders')
  async createPurchaseOrder(@Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/purchaseorders', 'POST', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('purchase-orders/:id')
  async getPurchaseOrder(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/purchaseorders/${id}`, 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Put('purchase-orders/:id')
  async updatePurchaseOrder(@Param('id') id: string, @Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/purchaseorders/${id}`, 'PUT', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Delete('purchase-orders/:id')
  async deletePurchaseOrder(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/purchaseorders/${id}`, 'DELETE');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CRUD Operations for Bills
  @Get('bills')
  async getBills(@Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/bills', 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('bills')
  async createBill(@Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/bills', 'POST', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('bills/:id')
  async getBill(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/bills/${id}`, 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Put('bills/:id')
  async updateBill(@Param('id') id: string, @Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/bills/${id}`, 'PUT', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Delete('bills/:id')
  async deleteBill(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/bills/${id}`, 'DELETE');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CRUD Operations for Debit Notes
  @Get('debit-notes')
  async getDebitNotes(@Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/debitnotes', 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('debit-notes')
  async createDebitNote(@Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/debitnotes', 'POST', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('debit-notes/:id')
  async getDebitNote(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/debitnotes/${id}`, 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Put('debit-notes/:id')
  async updateDebitNote(@Param('id') id: string, @Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/debitnotes/${id}`, 'PUT', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Delete('debit-notes/:id')
  async deleteDebitNote(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/debitnotes/${id}`, 'DELETE');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CRUD Operations for Vendor Payments
  @Get('vendor-payments')
  async getVendorPayments(@Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/vendorpayments', 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('vendor-payments')
  async createVendorPayment(@Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/vendorpayments', 'POST', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('vendor-payments/:id')
  async getVendorPayment(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/vendorpayments/${id}`, 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Put('vendor-payments/:id')
  async updateVendorPayment(@Param('id') id: string, @Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/vendorpayments/${id}`, 'PUT', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Delete('vendor-payments/:id')
  async deleteVendorPayment(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/vendorpayments/${id}`, 'DELETE');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CRUD Operations for Banking
  @Get('banking')
  async getBanking(@Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/banking', 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('banking')
  async createBanking(@Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api('/banking', 'POST', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('banking/:id')
  async getBankingDetails(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/banking/${id}`, 'GET');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Put('banking/:id')
  async updateBanking(@Param('id') id: string, @Query() query: any, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/banking/${id}`, 'PUT', query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Delete('banking/:id')
  async deleteBanking(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!this.authToken) {
        throw new Error('Authorization required. Please authenticate first.');
      }
      const result = await this.zohoBooks.api(`/banking/${id}`, 'DELETE');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}




