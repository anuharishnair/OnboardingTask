import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Icon } from 'semantic-ui-react';
import axios from 'axios';

const SalesModal = () => {
    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [dateSold, setDateSold] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [productId, setProductId] = useState('');
    const [storeId, setStoreId] = useState('');
    const [currentSaleId, setCurrentSaleId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [salesResponse, customersResponse, productsResponse, storesResponse] = await Promise.all([
                    axios.get('https://localhost:7178/api/Sales'),
                    axios.get('https://localhost:7178/api/Customers'),
                    axios.get('https://localhost:7178/api/Products'),
                    axios.get('https://localhost:7178/api/Stores')
                ]);

                setSales(salesResponse.data);
                setCustomers(customersResponse.data);
                setProducts(productsResponse.data);
                setStores(storesResponse.data);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getCustomerName = (customerId) => {
        const customer = customers.find(cust => cust.id === customerId);
        return customer ? customer.name : 'Unknown';
    };

    const getProductName = (productId) => {
        const product = products.find(prod => prod.id === productId);
        return product ? product.name : 'Unknown';
    };

    const getStoreName = (storeId) => {
        const store = stores.find(sto => sto.id === storeId);
        return store ? store.name : 'Unknown';
    };

    const handleChange = (e, { name, value }) => {
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
    };

    const handleOpen = (sale = null) => {
        if (sale) {
            const { id, dateSold, customer, product, store } = sale;
            setModalOpen(true);
            setCurrentSaleId(id);
            setDateSold(dateSold);
            setCustomerId(customer);
            setProductId(product);
            setStoreId(store);
        } else {
            setModalOpen(true);
            setCurrentSaleId(null);
            setDateSold('');
            setCustomerId('');
            setProductId('');
            setStoreId('');
        }
    };

    const handleClose = () => {
        setModalOpen(false);
    };

    const handleSubmit = () => {
        const saleData = { dateSold, customer: customerId, product: productId, store: storeId };

        const request = currentSaleId
            ? axios.put(`https://localhost:7178/api/Sales/${currentSaleId}`, saleData)
            : axios.post('https://localhost:7178/api/Sales', saleData);

        request
            .then(response => {
                setModalOpen(false);
                refreshSalesData(); // Refresh sales data after submit
            })
            .catch(error => {
                console.error('There was an error saving the sale!', error);
            });
    };

    const handleDelete = (id) => {
        axios.delete(`https://localhost:7178/api/Sales/${id}`)
            .then(response => {
                refreshSalesData(); // Refresh sales data after delete
            })
            .catch(error => {
                console.error('There was an error deleting the sale!', error);
            });
    };

    const refreshSalesData = () => {
        axios.get('https://localhost:7178/api/Sales')
            .then(response => {
                setSales(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the sales!', error);
            });
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
                        sales.map(sale => (
                            <Table.Row key={sale.id}>
                                <Table.Cell>{getCustomerName(sale.customer)}</Table.Cell>
                                <Table.Cell>{getProductName(sale.product)}</Table.Cell>
                                <Table.Cell>{getStoreName(sale.store)}</Table.Cell>
                                <Table.Cell>{sale.dateSold}</Table.Cell>
                                <Table.Cell>
                                    <Button color="yellow" onClick={() => handleOpen(sale)}>
                                        <Icon name="edit" /> Edit
                                    </Button>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button color="red" onClick={() => handleDelete(sale.id)}>
                                        <Icon name="delete" /> Delete
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    )}
                </Table.Body>
            </Table>

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
        </div>
    );
};

export default SalesModal;
