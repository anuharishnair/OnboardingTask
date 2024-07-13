import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import ProductList from './components/ProductList';
import StoreList from './components/StoreList';
import ReactPage from './components/ReactPage';
import SalesModal from './components/SalesModal';
import './components/NavMenu.css'; 

class App extends React.Component {
    render() {
        return (
            <Router>
                <div className="ui container">
                    <nav className="nav">
                        <ul className="nav-list">
                            <li className="nav-item">
                                <Link to="/">React</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/customers">Customers</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/products">Products</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/stores">Stores</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/sales">Sales</Link>
                            </li>
                        </ul>
                    </nav>

                    <Routes>
                        <Route path="/" element={<ReactPage />} />
                        <Route path="/customers" element={<CustomerList />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/stores" element={<StoreList />} />
                        <Route path="/sales" element={<SalesModal/>} />
                    </Routes>
                </div>
            </Router>
        );
    }
}

export default App;
