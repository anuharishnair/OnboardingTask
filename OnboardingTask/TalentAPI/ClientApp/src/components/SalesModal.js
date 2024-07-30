import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Icon, Pagination } from 'semantic-ui-react';
import axios from 'axios';
import { apiUrl } from '../config';

const SalesModal = () => {
    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [dateSold, setDateSold] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [productId, setProductId] = useState('');
    const [storeId, setStoreId] = useState('');
    const [currentSaleId, setCurrentSaleId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saleToDelete, setSaleToDelete] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [salesPerPage] = useState(8);

    const fetchData = async () => {
        try {
            const [salesResponse, customersResponse, productsResponse, storesResponse] = await Promise.all([
                axios.get(`${apiUrl}/api/sales`),
                axios.get(`${apiUrl}/api/customers`),
                axios.get(`${apiUrl}/api/products`),
                axios.get(`${apiUrl}/api/stores`)
            ]);
            if (Array.isArray(salesResponse.data) &&
                Array.isArray(customersResponse.data) &&
                Array.isArray(productsResponse.data) &&
                Array.isArray(storesResponse.data)) {
                setSales(salesResponse.data);
                setCustomers(customersResponse.data);
                setProducts(productsResponse.data);
                setStores(storesResponse.data);
            } else {
                throw new Error('Invalid data format received from one or more APIs');
            }
        } catch (error) {
            console.error('Error fetching initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const indexOfLastSale = currentPage * salesPerPage;
    const indexOfFirstSale = indexOfLastSale - salesPerPage;
    const currentSales = sales.slice(indexOfFirstSale, indexOfLastSale);
    const totalPages = Math.ceil(sales.length / salesPerPage);

    const handlePageChange = (e, { activePage }) => {
        setCurrentPage(activePage);
    };

    const getCustomerName = (customerId) => {
        try {
            if (!customerId) {
                return 'Unknown';
            }

            const customer = customers.find(cust => cust.id === customerId);
            return customer ? customer.name : 'Unknown';
        } catch (error) {
            console.error('Error getting customer name:', error);
            return 'Unknown';
        }
    };

    const getProductName = (productId) => {
        try {
            if (!productId) {
                return 'Unknown';
            }

            const product = products.find(prod => prod.id === productId);
            return product ? product.name : 'Unknown';
        } catch (error) {
            console.error('Error getting product name:', error);
            return 'Unknown';
        }
    };

    const getStoreName = (storeId) => {
        try {
            if (!storeId) {
                return 'Unknown';
            }

            const store = stores.find(sto => sto.id === storeId);
            return store ? store.name : 'Unknown';
        } catch (error) {
            console.error('Error getting store name:', error);
            return 'Unknown';
        }
    };

    const handleChange = (e, { name, value }) => {
        try {
            switch (name) {
                case 'dateSold':
                    setDateSold(value);
                    break;
                case 'customerId':
                    setCustomerId(value);
                    break;
                case 'productId':
                    setProductId(value);
                    break;
                case 'storeId':
                    setStoreId(value);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Error handling change:', error);
        }
    };

    const handleOpen = (sale = null) => {
        try {
            if (sale) {
                const { id, dateSold, customerId, productId, storeId } = sale;
                setModalOpen(true);
                setCurrentSaleId(id);
                setDateSold(formatDateForInput(dateSold));
                setCustomerId(customerId);
                setProductId(productId);
                setStoreId(storeId);
            } else {
                setModalOpen(true);
                setCurrentSaleId(null);
                setDateSold('');
                setCustomerId('');
                setProductId('');
                setStoreId('');
            }
        } catch (error) {
            console.error('Error opening modal:', error);
        }
    };

    const handleClose = () => {
        try {
            setModalOpen(false);
        } catch (error) {
            console.error('Error closing modal:', error);
        }
    };

    const handleSubmit = () => {
        try {
            const saleData = { dateSold, customerId, productId, storeId };

            const request = currentSaleId
                ? axios.put(`${apiUrl}/api/sales/${currentSaleId}`, saleData)
                : axios.post(`${apiUrl}/api/sales`, saleData);

            request
                .then(response => {
                    setModalOpen(false);
                    refreshSalesData();
                })
                .catch(error => {
                    console.error('There was an error saving the sale!', error);
                });
        } catch (error) {
            console.error('Error handling submit:', error);
        }
    };

    const confirmDelete = (sale) => {
        setSaleToDelete(sale);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        try {
            if (!saleToDelete || !saleToDelete.id) {
                console.error('Error: saleToDelete is not defined or saleToDelete.id is missing');
                return;
            }

            axios.delete(`${apiUrl}/api/sales/${saleToDelete.id}`)
                .then(response => {
                    if (response.status === 200) {
                        refreshSalesData();
                        setDeleteModalOpen(false);
                        setSaleToDelete(null);
                    } else {
                        console.error('Error: Unexpected response status', response.status);
                    }
                })
                .catch(error => {
                    console.error('There was an error deleting the sale!', error);
                });
        } catch (error) {
            console.error('Error handling delete:', error);
        }
    };

    const refreshSalesData = () => {
        try {
            axios.get(`${apiUrl}/api/sales`)
                .then(response => {
                    if (response.status === 200) {
                        setSales(response.data);
                    } else {
                        console.error('Error: Unexpected response status', response.status);
                    }
                })
                .catch(error => {
                    console.error('There was an error fetching the sales!', error);
                });
        } catch (error) {
            console.error('Error refreshing sales data:', error);
        }
    };

    const formatDateForDisplay = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const [month, day, year] = formattedDate.replace(/,/g, '').split(' ');
        return `${day} ${month}, ${year}`;
    };

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const renderSalesRows = () => {
        if (!Array.isArray(currentSales)) {
            console.error('Error: currentSales is not an array');
            return null;
        }

        return currentSales.map(sale => (
            <Table.Row key={sale.id}>
                <Table.Cell>{getCustomerName(sale.customerId)}</Table.Cell>
                <Table.Cell>{getProductName(sale.productId)}</Table.Cell>
                <Table.Cell>{getStoreName(sale.storeId)}</Table.Cell>
                <Table.Cell>{formatDateForDisplay(sale.dateSold)}</Table.Cell>
                <Table.Cell>
                    <Button color="yellow" onClick={() => handleOpen(sale)}>
                        <Icon name="edit" /> Edit
                    </Button>
                </Table.Cell>
                <Table.Cell>
                    <Button color="red" onClick={() => confirmDelete(sale)}>
                        <Icon name="delete" /> Delete
                    </Button>
                </Table.Cell>
            </Table.Row>
        ));
    };

    return (
        <div style={{ paddingTop: '100px', textAlign: 'left' }}>
            <Button primary onClick={() => handleOpen()}>New Sale</Button>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Customer</Table.HeaderCell>
                        <Table.HeaderCell>Product</Table.HeaderCell>
                        <Table.HeaderCell>Store</Table.HeaderCell>
                        <Table.HeaderCell>Date Sold</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {loading ? (
                        <Table.Row>
                            <Table.Cell colSpan={6} textAlign="center">Loading...</Table.Cell>
                        </Table.Row>
                    ) : (
                        renderSalesRows()
                    )}
                </Table.Body>
            </Table>

            {totalPages > 1 && (
                <Pagination
                    activePage={currentPage}
                    onPageChange={handlePageChange}
                    totalPages={totalPages}
                />
            )}

            <Modal open={modalOpen} onClose={handleClose}>
                <Modal.Header>{currentSaleId ? 'Edit Sale' : 'Create Sale'}</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input
                            label="Date Sold"
                            type="date"
                            name="dateSold"
                            value={dateSold}
                            onChange={handleChange}
                        />
                        <Form.Select
                            label="Customer"
                            name="customerId"
                            value={customerId}
                            options={customers.map(customer => ({
                                key: customer.id,
                                text: customer.name,
                                value: customer.id,
                            }))}
                            onChange={(e, { value }) => setCustomerId(value)}
                        />
                        <Form.Select
                            label="Product"
                            name="productId"
                            value={productId}
                            options={products.map(product => ({
                                key: product.id,
                                text: product.name,
                                value: product.id,
                            }))}
                            onChange={(e, { value }) => setProductId(value)}
                        />
                        <Form.Select
                            label="Store"
                            name="storeId"
                            value={storeId}
                            options={stores.map(store => ({
                                key: store.id,
                                text: store.name,
                                value: store.id,
                            }))}
                            onChange={(e, { value }) => setStoreId(value)}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        positive
                        icon="checkmark"
                        labelPosition="right"
                        content={currentSaleId ? 'Save' : 'Create'}
                        onClick={handleSubmit}
                    />
                </Modal.Actions>
            </Modal>

            <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <Modal.Header>Confirm Delete</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete this sale?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => setDeleteModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        negative
                        icon="delete"
                        labelPosition="right"
                        content="Delete"
                        onClick={handleDelete}
                    />
                </Modal.Actions>
            </Modal>
        </div>
    );
};

export default SalesModal;
