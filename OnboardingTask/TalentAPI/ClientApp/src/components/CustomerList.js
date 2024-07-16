import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table, Icon } from 'semantic-ui-react';

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
    };

    componentDidMount() {
        this.fetchCustomers();
    }

    fetchCustomers = async () => {
        try {
            const response = await axios.get('https://localhost:7178/api/Customers');
            this.setState({ customers: response.data });
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    handleOpen = (isEditing = false, customer = null) => {
        if (isEditing && customer) {
            this.setState({
                modalOpen: true,
                isEditing: true,
                editCustomerId: customer.id,
                name: customer.name,
                address: customer.address,
            });
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
                await axios.put(`https://localhost:7178/api/Customers/${editCustomerId}`, customerData);
                this.setState({
                    modalOpen: false,
                    isEditing: false,
                    name: '',
                    address: '',
                    editCustomerId: null,
                }, () => {
                    this.fetchCustomers(); // Fetch customers after state update
                });
            } else {
                const response = await axios.post('https://localhost:7178/api/Customers/CreateCustomerAsync', customerData);
                console.log('Customer created successfully:', response.data);
                this.setState({
                    modalOpen: false,
                    name: '',
                    address: '',
                }, () => {
                    this.fetchCustomers(); // Fetch customers after state update
                });
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

        try {
            await axios.delete(`https://localhost:7178/api/Customers/${deleteCustomerId}`);
            this.setState({
                deleteConfirmationOpen: false,
                deleteCustomerId: null,
            });
            this.fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    renderCustomerRows = () => {
        const { customers } = this.state;

        return customers.map((customer) => (
            <Table.Row key={customer.id}>
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
    };

    render() {
        const { name, address, modalOpen, isEditing, deleteConfirmationOpen } = this.state;

        return (
            <div style={{ paddingTop: '100px', textAlign: 'left' }}>
                <Button primary onClick={() => this.handleOpen(false)}>
                    New Customer
                </Button>
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
                <Table celled>
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
            </div>
        );
    }
}

export default CustomerList;
