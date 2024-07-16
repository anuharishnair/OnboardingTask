import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table, Icon } from 'semantic-ui-react';

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
    };

    componentDidMount() {
        this.fetchStores();
    }

    fetchStores = async () => {
        try {
            const response = await axios.get('https://localhost:7178/api/Stores');
            this.setState({ stores: response.data });
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };

    handleStoreOpen = (isEditing = false, store = null) => {
        try {
            if (isEditing && store) {
                this.setState({
                    modalOpen: true,
                    isEditingStore: true,
                    editStoreId: store.id,
                    storeName: store.name,
                    storeAddress: store.address,
                });
            } else {
                this.setState({ modalOpen: true });
            }
        } catch (error) {
            console.error('Error opening store modal:', error);
        }
    };

    handleCloseStore = () => {
        try {
            this.setState({ modalOpen: false, isEditingStore: false, storeName: '', storeAddress: '', editStoreId: null });
        } catch (error) {
            console.error('Error closing store modal:', error);
        }
    };

    handleStoreChange = (e) => {
        try {
            this.setState({ [e.target.name]: e.target.value });
        } catch (error) {
            console.error('Error handling store change:', error);
        }
    };

    handleStoreSubmit = async () => {
        const { storeName, storeAddress, isEditingStore, editStoreId } = this.state;

        const storeData = {
            name: storeName,
            address: storeAddress,
        };

        try {
            if (isEditingStore) {
                await axios.put(`https://localhost:7178/api/Stores/${editStoreId}`, storeData);
                this.setState({ modalOpen: false, isEditingStore: false, storeName: '', storeAddress: '', editStoreId: null });
            } else {
                await axios.post('https://localhost:7178/api/Stores', storeData);
                this.setState({ modalOpen: false, storeName: '', storeAddress: '' });
            }
            this.fetchStores();
        } catch (error) {
            console.error('Error submitting store:', error);
        }
    };

    handleStoreDelete = (id) => {
        try {
            this.setState({ deleteConfirmationOpen: true, deleteStoreId: id });
        } catch (error) {
            console.error('Error setting delete confirmation:', error);
        }
    };

    confirmStoreDelete = async () => {
        const { deleteStoreId } = this.state;

        try {
            await axios.delete(`https://localhost:7178/api/Stores/${deleteStoreId}`);
            this.setState({
                deleteConfirmationOpen: false,
                deleteStoreId: null,
            });
            this.fetchStores();
        } catch (error) {
            console.error('Error deleting store:', error);
        }
    };

    renderStoreRows = () => {
        const { stores } = this.state;

        return stores.map((store) => (
            <Table.Row key={store.id}>
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
    };

    render() {
        const { storeName, storeAddress, modalOpen, isEditingStore, deleteConfirmationOpen } = this.state;

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
                            <Form.Field>
                                <label>NAME</label>
                                <input
                                    name="storeName"
                                    value={storeName}
                                    onChange={this.handleStoreChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>ADDRESS</label>
                                <input
                                    name="storeAddress"
                                    value={storeAddress}
                                    onChange={this.handleStoreChange}
                                />
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

            </div>
        );
    }
}

export default StoreList;
