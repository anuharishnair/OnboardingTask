import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table, Icon, Pagination } from 'semantic-ui-react';
import { apiUrl } from '../config';

class StoreList extends React.Component {
    state = {
        stores: [],
        storeName: '',
        storeAddress: '',
        modalOpen: false,
        isEditingStore: false,
        editStoreId: null,
        deleteConfirmationOpen: false,
        deleteStoreId: null,
        selectedStoreId: null,
        currentPage: 1,
        storesPerPage: 8,
        storeNameError: false,
        storeAddressError: false,
    };

    componentDidMount() {
        this.fetchStores();
    }

    fetchStores = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/stores`);
            if (response.status >= 200 && response.status < 300) {
                this.setState({ stores: response.data });
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };

    handleStoreOpen = async (isEditing = false, store = null) => {
        if (isEditing && store) {
            try {
                const response = await axios.get(`${apiUrl}/api/stores/${store.id}`);
                if (response.status >= 200 && response.status < 300) {
                    const storeDetails = response.data;
                    this.setState({
                        modalOpen: true,
                        isEditingStore: true,
                        editStoreId: store.id,
                        storeName: storeDetails.name,
                        storeAddress: storeDetails.address,
                        selectedStoreId: store.id,
                    });
                } else {
                    console.error('Failed to fetch store details: Invalid response');
                }
            } catch (error) {
                console.error('Error fetching store details:', error);
            }
        } else {
            this.setState({ modalOpen: true, isEditingStore: false, storeName: '', storeAddress: '', editStoreId: null });
        }
    };

    handleCloseStore = () => {
        this.setState({
            modalOpen: false,
            isEditingStore: false,
            storeName: '',
            storeAddress: '',
            editStoreId: null,
            deleteConfirmationOpen: false,
            storeNameError: false,
            storeAddressError: false,
        });
    };

    handleStoreChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleStoreSubmit = async () => {
        const { storeName, storeAddress, isEditingStore, editStoreId } = this.state;

        // Reset error states
        this.setState({ storeNameError: !storeName, storeAddressError: !storeAddress });

        // Validate fields
        if (!storeName || !storeAddress) {
            return;
        }

        const storeData = { name: storeName, address: storeAddress };

        try {
            if (isEditingStore) {
                if (editStoreId) {
                    const response = await axios.put(`${apiUrl}/api/stores/${editStoreId}`, storeData);
                    if (response.status >= 200 && response.status < 300) {
                        this.handleCloseStore();
                        this.fetchStores(); // Refresh store data after submit
                    } else {
                        console.error('Failed to update store: Invalid response');
                    }
                } else {
                    console.error('No store ID provided for editing.');
                }
            } else {
                const response = await axios.post(`${apiUrl}/api/stores`, storeData);
                if (response.status >= 200 && response.status < 300) {
                    this.handleCloseStore();
                    this.fetchStores(); // Refresh store data after submit
                } else {
                    console.error('Failed to create store: Invalid response');
                }
            }
        } catch (error) {
            console.error('Error submitting store:', error);
        }
    };

    handleStoreDelete = (id) => {
        this.setState({ deleteConfirmationOpen: true, deleteStoreId: id });
    };

    confirmStoreDelete = async () => {
        const { deleteStoreId } = this.state;

        if (deleteStoreId) {
            try {
                const response = await axios.delete(`${apiUrl}/api/stores/${deleteStoreId}`);
                if (response.status >= 200 && response.status < 300) {
                    this.setState({ deleteConfirmationOpen: false, deleteStoreId: null });
                    this.fetchStores(); // Refresh store data after delete
                } else {
                    console.error('Failed to delete store: Invalid response');
                }
            } catch (error) {
                console.error('Error deleting store:', error);
            }
        } else {
            console.error('No store ID provided for deletion.');
        }
    };

    handleRowClick = async (storeId) => {
        try {
            const response = await axios.get(`${apiUrl}/api/stores/${storeId}`);
            if (response.status >= 200 && response.status < 300) {
                const storeDetails = response.data;
                this.setState({
                    selectedStoreId: storeId,
                    storeName: storeDetails.name,
                    storeAddress: storeDetails.address,
                });
            } else {
                console.error('Failed to fetch store details: Invalid response');
            }
        } catch (error) {
            console.error('Error fetching store details:', error);
        }
    };

    handlePageChange = (e, { activePage }) => {
        this.setState({ currentPage: activePage });
    };

    renderStoreRows = () => {
        const { stores, selectedStoreId, currentPage, storesPerPage } = this.state;
        const indexOfLastStore = currentPage * storesPerPage;
        const indexOfFirstStore = indexOfLastStore - storesPerPage;
        const currentStores = stores.slice(indexOfFirstStore, indexOfLastStore);

        if (Array.isArray(currentStores) && currentStores.length > 0) {
            return currentStores.map((store) => (
                <Table.Row
                    key={store.id}
                    active={selectedStoreId === store.id}
                    onClick={() => this.handleRowClick(store.id)}
                >
                    <Table.Cell>{store.name}</Table.Cell>
                    <Table.Cell>{store.address}</Table.Cell>
                    <Table.Cell>
                        <Button color="yellow" onClick={() => this.handleStoreOpen(true, store)}>
                            <Icon name="edit" /> Edit
                        </Button>
                    </Table.Cell>
                    <Table.Cell>
                        <Button color="red" onClick={() => this.handleStoreDelete(store.id)}>
                            <Icon name="delete" /> Delete
                        </Button>
                    </Table.Cell>
                </Table.Row>
            ));
        } else {
            return (
                <Table.Row>
                    <Table.Cell colSpan="4" textAlign="center">No stores available</Table.Cell>
                </Table.Row>
            );
        }
    };

    renderPagination = () => {
        const { stores, currentPage, storesPerPage } = this.state;
        const totalPages = Math.ceil(stores.length / storesPerPage);

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
        const { storeName, storeAddress, modalOpen, isEditingStore, deleteConfirmationOpen, storeNameError, storeAddressError } = this.state;

        return (
            <div style={{ paddingTop: '100px', textAlign: 'left' }}>
                <Button primary onClick={() => this.handleStoreOpen(false)}>
                    New Store
                </Button>

                {/* Store Modal */}
                <Modal open={modalOpen} onClose={this.handleCloseStore}>
                    <Modal.Header>{isEditingStore ? 'Edit Store' : 'Create Store'}</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field error={storeNameError}>
                                <label>Name</label>
                                <input
                                    name="storeName"
                                    value={storeName}
                                    onChange={this.handleStoreChange}
                                />
                                {storeNameError && <div style={{ color: 'red' }}>Name is required</div>}
                            </Form.Field>
                            <Form.Field error={storeAddressError}>
                                <label>Address</label>
                                <input
                                    name="storeAddress"
                                    value={storeAddress}
                                    onChange={this.handleStoreChange}
                                />
                                {storeAddressError && <div style={{ color: 'red' }}>Address is required</div>}
                            </Form.Field>
                            <Button onClick={this.handleCloseStore}>Cancel</Button>
                            <Button positive onClick={this.handleStoreSubmit}>
                                {isEditingStore ? 'Update' : 'Create'}
                            </Button>
                        </Form>
                    </Modal.Content>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal open={deleteConfirmationOpen} onClose={() => this.setState({ deleteConfirmationOpen: false })}>
                    <Modal.Header>Delete Store</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={this.confirmStoreDelete}>Delete</Button>
                        <Button onClick={() => this.setState({ deleteConfirmationOpen: false })}>Cancel</Button>
                    </Modal.Actions>
                </Modal>

                {/* Store Table */}
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
                        {this.renderStoreRows()}
                    </Table.Body>
                </Table>

                {/* Pagination */}
                {this.renderPagination()}
            </div>
        );
    }
}

export default StoreList;
