import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table, Icon } from 'semantic-ui-react';

class ProductList extends React.Component {
    state = {
        products: [],
        productName: '',
        productPrice: '',
        modalOpen: false,
        isEditingProduct: false,
        editProductId: null,
        deleteConfirmationOpen: false,
        deleteProductId: null,
    };

    componentDidMount() {
        this.fetchProducts();
    }

    fetchProducts = () => {
        axios.get('https://localhost:7178/api/Products').then((response) => {
            this.setState({ products: response.data });
        });
    };

    handleProductOpen = (isEditing = false, product = null) => {
        if (isEditing && product) {
            this.setState({
                modalOpen: true,
                isEditingProduct: true,
                editProductId: product.id,
                productName: product.name,
                productPrice: product.price,
            });
        } else {
            this.setState({ modalOpen: true });
        }
    };

    handleCloseProduct = () => {
        this.setState({ modalOpen: false, isEditingProduct: false, productName: '', productPrice: '', editProductId: null });
    };

    handleProductChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleProductSubmit = () => {
        const { productName, productPrice, isEditingProduct, editProductId } = this.state;

        const productData = {
            name: productName,
            price: productPrice,
        };

        if (isEditingProduct) {
            axios.put(`https://localhost:7178/api/Products/${editProductId}`, productData).then((response) => {
                this.setState({ modalOpen: false, isEditingProduct: false, productName: '', productPrice: '', editProductId: null });
                this.fetchProducts();
            });
        } else {
            axios.post('https://localhost:7178/api/Products', productData).then((response) => {
                this.setState({ modalOpen: false, productName: '', productPrice: '' });
                this.fetchProducts();
            });
        }
    };

    handleProductDelete = (id) => {
        this.setState({ deleteConfirmationOpen: true, deleteProductId: id });
    };

    confirmProductDelete = () => {
        const { deleteProductId } = this.state;

        axios.delete(`https://localhost:7178/api/Products/${deleteProductId}`).then((response) => {
            this.setState({
                deleteConfirmationOpen: false,
                deleteProductId: null,
            });
            this.fetchProducts();
        });
    };

    render() {
        const { products, productName, productPrice, modalOpen, isEditingProduct, deleteConfirmationOpen } = this.state;

        return (
            <div style={{ paddingTop: '100px', textAlign: 'left' }}>
                <Button primary onClick={() => this.handleProductOpen(false)}>
                    New Product
                </Button>

                {/* Product Modal */}
                <Modal open={modalOpen} onClose={this.handleCloseProduct}>
                    <Modal.Header>{isEditingProduct ? 'Edit Product' : 'Create Product'}</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>NAME</label>
                                <input
                                    name="productName"
                                    value={productName}
                                    onChange={this.handleProductChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>PRICE</label>
                                <input
                                    name="productPrice"
                                    value={productPrice}
                                    onChange={this.handleProductChange}
                                />
                            </Form.Field>
                            <Button onClick={this.handleCloseProduct}>Cancel</Button>
                            <Button positive onClick={this.handleProductSubmit}>
                                {isEditingProduct ? 'Update' : 'Create'}
                            </Button>
                        </Form>
                    </Modal.Content>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal open={deleteConfirmationOpen} onClose={() => this.setState({ deleteConfirmationOpen: false })}>
                    <Modal.Header>Delete product</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={this.confirmProductDelete}>Delete</Button>
                        <Button onClick={() => this.setState({ deleteConfirmationOpen: false })}>Cancel</Button>
                    </Modal.Actions>
                </Modal>

                {/* Product Table */}
                <Table celled style={{ marginTop: '20px' }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Price</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {products.map((product) => (
                            <Table.Row key={product.id}>
                                <Table.Cell>{product.name}</Table.Cell>
                                <Table.Cell>{product.price}</Table.Cell>
                                <Table.Cell>
                                    <Button color="yellow" onClick={() => this.handleProductOpen(true, product)}>
                                        <Icon name="edit" /> Edit
                                    </Button>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button color="red" onClick={() => this.handleProductDelete(product.id)}>
                                        <Icon name="delete" /> Delete
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

            </div>
        );
    }
}

export default ProductList;
