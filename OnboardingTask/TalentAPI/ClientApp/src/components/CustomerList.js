import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table, Icon, Pagination } from 'semantic-ui-react';
import { apiUrl } from '../config'; // Adjust the path if necessary

class CustomerList extends React.Component {
    state = {
        customers: [],
        name: '',
        address: '',
        modalOpen: false,
        isEditing: false,
        editCustomerId: null,
        deleteConfirmationOpen: false,
        deleteCustomerId: null,
        selectedCustomerId: null,
        currentPage: 1,
        customersPerPage: 8,
    };

    componentDidMount() {
        this.fetchCustomers();
    }

    fetchCustomers = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/customers`);
            if (response.status >= 200 && response.status < 300) {
                this.setState({ customers: response.data });
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    handleOpen = async (isEditing = false, customer = null) => {
        if (isEditing && customer) {
            try {
                const response = await axios.get(`${apiUrl}/api/customers/${customer.id}`);
                if (response.status >= 200 && response.status < 300) {
                    const customerDetails = response.data;
                    this.setState({
                        modalOpen: true,
                        isEditing: true,
                        editCustomerId: customer.id,
                        name: customerDetails.name,
                        address: customerDetails.address,
                        selectedCustomerId: customer.id,
                    });
                } else {
                    console.error('Failed to fetch customer details: Invalid response');
                }
            } catch (error) {
                console.error('Error fetching customer details:', error);
            }
        } else {
            this.setState({ modalOpen: true, isEditing: false, name: '', address: '', editCustomerId: null });
        }
    };

    handleClose = () => {
        this.setState({
            modalOpen: false,
            isEditing: false,
            name: '',
            address: '',
            editCustomerId: null,
            deleteConfirmationOpen: false,
        });
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async () => {
        const { name, address, isEditing, editCustomerId } = this.state;
        const customerData = { name, address };

        try {
            if (isEditing) {
                if (editCustomerId) {
                    const response = await axios.put(`${apiUrl}/api/customers/${editCustomerId}`, customerData);
                    if (response.status >= 200 && response.status < 300) {
                        this.handleClose();
                        this.fetchCustomers();  // Refresh data
                    } else {
                        console.error('Failed to update customer: Invalid response');
                    }
                } else {
                    console.error('No customer ID provided for update');
                }
            } else {
                const response = await axios.post(`${apiUrl}/api/customers/`, customerData);
                if (response.status >= 200 && response.status < 300) {
                    this.handleClose();
                    this.fetchCustomers();  // Refresh data
                } else {
                    console.error('Failed to create customer: Invalid response');
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    handleDelete = (id) => {
        this.setState({ deleteConfirmationOpen: true, deleteCustomerId: id });
    };

    confirmDelete = async () => {
        const { deleteCustomerId } = this.state;

        if (deleteCustomerId) {
            try {
                const response = await axios.delete(`${apiUrl}/api/customers/${deleteCustomerId}`);
                if (response.status >= 200 && response.status < 300) {
                    this.setState({ deleteConfirmationOpen: false, deleteCustomerId: null });
                    this.fetchCustomers();  // Refresh data
                } else {
                    console.error('Failed to delete customer: Invalid response');
                }
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
        } else {
            console.error('No customer ID provided for deletion');
        }
    };

    handleRowClick = async (customerId) => {
        try {
            const response = await axios.get(`${apiUrl}/api/customers/${customerId}`);
            if (response.status >= 200 && response.status < 300) {
                const customerDetails = response.data;
                this.setState({
                    selectedCustomerId: customerId,
                    name: customerDetails.name,
                    address: customerDetails.address,
                });
            } else {
                console.error('Failed to fetch customer details: Invalid response');
            }
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    };

    handlePageChange = (e, { activePage }) => {
        this.setState({ currentPage: activePage });
    };

    renderCustomerRows = () => {
        const { customers, selectedCustomerId, currentPage, customersPerPage } = this.state;
        const indexOfLastCustomer = currentPage * customersPerPage;
        const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
        const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

        if (Array.isArray(currentCustomers) && currentCustomers.length > 0) {
            return currentCustomers.map((customer) => (
                <Table.Row
                    key={customer.id}
                    active={selectedCustomerId === customer.id}
                    onClick={() => this.handleRowClick(customer.id)}
                >
                    <Table.Cell>{customer.name}</Table.Cell>
                    <Table.Cell>{customer.address}</Table.Cell>
                    <Table.Cell>
                        <Button color="yellow" onClick={() => this.handleOpen(true, customer)}>
                            <Icon name="edit" /> Edit
                        </Button>
                    </Table.Cell>
                    <Table.Cell>
                        <Button color="red" onClick={() => this.handleDelete(customer.id)}>
                            <Icon name="delete" /> Delete
                        </Button>
                    </Table.Cell>
                </Table.Row>
            ));
        } else {
            return (
                <Table.Row>
                    <Table.Cell colSpan="4" textAlign="center">No customers available</Table.Cell>
                </Table.Row>
            );
        }
    };

    renderPagination = () => {
        const { customers, currentPage, customersPerPage } = this.state;
        const totalPages = Math.ceil(customers.length / customersPerPage);

        if (totalPages > 1) {
            return (
                <Pagination
                    activePage={currentPage}
                    totalPages={totalPages}
                    onPageChange={this.handlePageChange}
                />
            );
        }
    };

    render() {
        const { name, address, modalOpen, isEditing, deleteConfirmationOpen } = this.state;

        return (
            <div style={{ paddingTop: '100px', textAlign: 'left' }}>
                <Button primary onClick={() => this.handleOpen(false)}>
                    New Customer
                </Button>

                {/* Customer Modal */}
                <Modal open={modalOpen} onClose={this.handleClose}>
                    <Modal.Header>{isEditing ? 'Edit Customer' : 'Create Customer'}</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>NAME</label>
                                <input
                                    name="name"
                                    value={name}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>ADDRESS</label>
                                <input
                                    name="address"
                                    value={address}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Button onClick={this.handleClose}>Cancel</Button>
                            <Button positive onClick={this.handleSubmit}>
                                {isEditing ? 'Update' : 'Create'}
                            </Button>
                        </Form>
                    </Modal.Content>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal open={deleteConfirmationOpen} onClose={() => this.setState({ deleteConfirmationOpen: false })}>
                    <Modal.Header>Delete Customer</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={this.confirmDelete}>Delete</Button>
                        <Button onClick={() => this.setState({ deleteConfirmationOpen: false })}>Cancel</Button>
                    </Modal.Actions>
                </Modal>

                {/* Customer Table */}
                <Table celled style={{ marginTop: '20px' }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Address</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderCustomerRows()}
                    </Table.Body>
                </Table>

                {/* Pagination */}
                {this.renderPagination()}
            </div>
        );
    }
}

export default CustomerList;
