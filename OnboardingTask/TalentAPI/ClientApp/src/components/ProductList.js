import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table, Icon, Pagination } from 'semantic-ui-react';
import { apiUrl } from '../config'; 

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
        selectedProductId: null,
        currentPage: 1,
        productsPerPage: 8,
        nameError: false,
        addressError: false,
    };

    componentDidMount() {
        this.fetchProducts();
    }

    fetchProducts = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/products`);
            if (response.status >= 200 && response.status < 300) {
                this.setState({ products: response.data });
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    handleOpen = async (isEditing = false, product = null) => {
        if (isEditing && product) {
            try {
                const response = await axios.get(`${apiUrl}/api/products/${product.id}`);
                if (response.status >= 200 && response.status < 300) {
                    const productDetails = response.data;
                    this.setState({
                        modalOpen: true,
                        isEditingProduct: true,
                        editProductId: product.id,
                        productName: productDetails.name,
                        productPrice: productDetails.price,
                        selectedProductId: product.id,
                    });
                } else {
                    console.error('Failed to fetch product details: Invalid response');
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        } else {
            this.setState({ modalOpen: true, isEditingProduct: false, productName: '', productPrice: '', editProductId: null });
        }
    };

    handleClose = () => {
        this.setState({
            modalOpen: false,
            isEditingProduct: false,
            productName: '',
            productPrice: '',
            editProductId: null,
            deleteConfirmationOpen: false,
        });
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async () => {
        const { productName, productPrice, isEditingProduct, editProductId } = this.state;

        // Reset error states
        this.setState({ productNameError: !productName, productPriceError: !productPrice });

        // Validate fields
        if (!productName || !productPrice) {
            return;
        }

        const productData = { name: productName, price: productPrice };

        try {
            if (isEditingProduct) {
                if (editProductId) {
                    const response = await axios.put(`${apiUrl}/api/products/${editProductId}`, productData);
                    if (response.status >= 200 && response.status < 300) {
                        this.handleClose();
                        this.fetchProducts(); // Refresh data
                    } else {
                        console.error('Failed to update product: Invalid response');
                    }
                } else {
                    console.error('No product ID provided for update');
                }
            } else {
                const response = await axios.post(`${apiUrl}/api/products`, productData);
                if (response.status >= 200 && response.status < 300) {
                    this.handleClose();
                    this.fetchProducts(); // Refresh data
                } else {
                    console.error('Failed to create product: Invalid response');
                }
            }
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    };

    handleDelete = (id) => {
        this.setState({ deleteConfirmationOpen: true, deleteProductId: id });
    };

    confirmDelete = async () => {
        const { deleteProductId } = this.state;

        if (deleteProductId) {
            try {
                const response = await axios.delete(`${apiUrl}/api/products/${deleteProductId}`);
                if (response.status >= 200 && response.status < 300) {
                    this.setState({ deleteConfirmationOpen: false, deleteProductId: null });
                    this.fetchProducts(); // Refresh data
                } else {
                    console.error('Failed to delete product: Invalid response');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        } else {
            console.error('No product ID provided for deletion');
        }
    };

    handleRowClick = async (productId) => {
        try {
            const response = await axios.get(`${apiUrl}/api/products/${productId}`);
            if (response.status >= 200 && response.status < 300) {
                const productDetails = response.data;
                this.setState({
                    selectedProductId: productId,
                    productName: productDetails.name,
                    productPrice: productDetails.price,
                });
            } else {
                console.error('Failed to fetch product details: Invalid response');
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    handlePageChange = (e, { activePage }) => {
        this.setState({ currentPage: activePage });
    };

    renderProductRows = () => {
        const { products, selectedProductId, currentPage, productsPerPage } = this.state;
        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

        if (Array.isArray(currentProducts) && currentProducts.length > 0) {
            return currentProducts.map((product) => (
                <Table.Row
                    key={product.id}
                    active={selectedProductId === product.id}
                    onClick={() => this.handleRowClick(product.id)}
                >
                    <Table.Cell>{product.name}</Table.Cell>
                    <Table.Cell>{product.price}</Table.Cell>
                    <Table.Cell>
                        <Button color="yellow" onClick={() => this.handleOpen(true, product)}>
                            <Icon name="edit" /> Edit
                        </Button>
                    </Table.Cell>
                    <Table.Cell>
                        <Button color="red" onClick={() => this.handleDelete(product.id)}>
                            <Icon name="delete" /> Delete
                        </Button>
                    </Table.Cell>
                </Table.Row>
            ));
        } else {
            return (
                <Table.Row>
                    <Table.Cell colSpan="4" textAlign="center">No products available</Table.Cell>
                </Table.Row>
            );
        }
    };

    renderPagination = () => {
        const { products, currentPage, productsPerPage } = this.state;
        const totalPages = Math.ceil(products.length / productsPerPage);

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
        const { productName, productPrice, modalOpen, isEditingProduct, deleteConfirmationOpen, productNameError, productPriceError } = this.state;

        return (
            <div style={{ paddingTop: '100px', textAlign: 'left' }}>
                <Button primary onClick={() => this.handleOpen(false)}>
                    New Product
                </Button>

                {/* Product Modal */}
                <Modal open={modalOpen} onClose={this.handleClose}>
                    <Modal.Header>{isEditingProduct ? 'Edit Product' : 'Create Product'}</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field error={productNameError}>
                                <label>NAME</label>
                                <input
                                    name="productName"
                                    value={productName}
                                    onChange={this.handleChange}
                                />
                                {productNameError && <div style={{ color: 'red' }}>Product name is required</div>}
                            </Form.Field>
                            <Form.Field error={productPriceError}>
                                <label>PRICE</label>
                                <input
                                    name="productPrice"
                                    value={productPrice}
                                    onChange={this.handleChange}
                                />
                                {productPriceError && <div style={{ color: 'red' }}>Product price is required</div>}
                            </Form.Field>
                            <Button onClick={this.handleClose}>Cancel</Button>
                            <Button positive onClick={this.handleSubmit}>
                                {isEditingProduct ? 'Update' : 'Create'}
                            </Button>
                        </Form>
                    </Modal.Content>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal open={deleteConfirmationOpen} onClose={() => this.setState({ deleteConfirmationOpen: false })}>
                    <Modal.Header>Delete Product</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={this.confirmDelete}>Delete</Button>
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
                        {this.renderProductRows()}
                    </Table.Body>
                </Table>

                {/* Pagination */}
                {this.renderPagination()}
            </div>
        );
    }

}

export default ProductList;
