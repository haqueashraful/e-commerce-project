"use client";

import React, { useContext, useState, useEffect } from 'react';
import './style.css';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import axios from 'axios';
import Link from 'next/link';
import MyContext from '@/context/ThemeContext';
import QuantityBox from '@/component/quantityBox';
import { useRouter } from 'next/navigation';
import { fetchDataFormApi } from '@/Utils/utils';

const Cart = () => {
    const router = useRouter();
    const [cartItems, setCartItems] = useState([]);
    const [cartData, setCartData] = useState([]);
    const context = useContext(MyContext);

    useEffect(() => {
        if (context.isLogin !== "true") {
            // router.push("/signIn");
        } else {
            setCartItems(context.cartItems);
        }
        window.scrollTo(0, 0);
    }, [context.cartItems]);

    const updateCart = (items) => {
        setCartItems(items);
    }

    const subtotal = cartItems.reduce((total, item) => {
        const quantity = item.quantity ? item.quantity : item.attributes.quantity;
        return total + item.attributes.price * quantity;
    }, 0);


    const getCartItem = async () => {
        try {
            const { data } = await fetchDataFormApi('/api/carts?populate=*');
            await setCartItems(data);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }

    const getCartData = async () => {
        try {
            const { data } = await fetchDataFormApi('/api/carts?populate=*');

            // const productDataPromises = data.map(async (item) => {
            //     setCartItems(item.attributes);
            //     // setCartItems(item.attributes);
            //     const res = await fetchDataFormApi(`/api/products?populate=*&[filters][id]=${item.attributes.productId}`);
            //     return { ...item, product: res.data[0] };
            // });

            // const productsData = await Promise.all(productDataPromises);
            await console.log(data, "data");
            await setCartData(data);

        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    useEffect(() => {
        getCartData();
        getCartItem();
    }, []);

    // const emptyCart = async () => {
    //     let response = null;
    //     if (cartItems.length !== 0) {
    //         response = await Promise.all(cartItems.map(item =>
    //             axios.delete(`http://localhost:5000/cartItems/${parseInt(item.id)}`)
    //         ));
    //     }
    //     if (response !== null) {
    //         getCartData();
    //     }

    //     context.emptyCart();
    // }


    // useEffect(() => {
    //     console.log(cartItems, "quantity");

    // }, [cartItems]);

    useEffect(() => {
        console.log(cartItems, "quantity");
    }, [cartItems]);

    return (
        <>
            {
                context.windowWidth > 992 && (
                    <div className="breadcrumbWrapper mb-4">
                        <div className="container-fluid">
                            <ul className="breadcrumb breadcrumb2 mb-0">
                                <li>
                                    <Link href="/">Home</Link>
                                </li>
                                <li>
                                    Shop
                                </li>
                                <li>
                                    Cart
                                </li>
                            </ul>
                        </div>
                    </div>
                )
            }

            <section className='cartSection mb-5'>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-md-8'>
                            <div className='d-flex align-items-center w-100'>
                                <div className='left'>
                                    <h1 className='hd mb-0'>Your Cart</h1>
                                    <p>There are <span className='text-g'>{cartItems.length}</span> products in your cart</p>
                                </div>
                            </div>

                            <div className='cartWrapper mt-4'>
                                <div className='table-responsive'>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Name</th>
                                                <th>Unit Price</th>
                                                <th>Quantity</th>
                                                <th>Subtotal</th>
                                                <th>Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                cartData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td >
                                                            <div className='d-flex align-items-center'>
                                                                <div style={{ width: "200px" }} className='img'>
                                                                    <Link href={`/product/${item.attributes.productId}`}>
                                                                        <img src={`http://localhost:1337${item.attributes.imageUrl}`} className='w-100' />
                                                                    </Link>
                                                                </div>
                                                                {/* <div className='info pl-4'>
                                                                    <Link href={`/product/${item.productId}`}><h4>{item.name}</h4></Link>
                                                                    <Rating 
                                                                        name="half-rating-read"
                                                                        value={parseFloat(item.product.attributes.rating)} 
                                                                        precision={0.5} 
                                                                        readOnly 
                                                                    /> 
                                                                    <span className='text-light'>({parseFloat(item.product.attributes.rating)})</span>
                                                                </div> */}
                                                            </div>
                                                        </td>
                                                        <td><span>{item.attributes.name}</span></td>
                                                        <td ><span>Rs: {item.attributes.price}</span></td>
                                                        <td>
                                                            <QuantityBox item={item} cartItems={cartItems} index={index} updateCart={updateCart} />
                                                        </td>
                                                        <td>
                                                            <span className='text-g'>
                                                                Rs. {
                                                                    (cartItems[index].quantity ? cartItems[index].quantity : cartItems[index].attributes.quantity) * cartItems[index].attributes.price
                                                                }
                                                            </span>
                                                        </td>
                                                        <td align='center'>
                                                            <span className='cursor' onClick={() => context.removeItemsFromCart(cartItems[index].id)}>
                                                                <DeleteOutlineOutlinedIcon />
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <br />
                            <div className='d-flex align-items-center'>
                                <Link href="/">
                                    <Button className='btn-g'>
                                        <KeyboardBackspaceIcon /> Continue Shopping
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className='col-md-4 cartRightBox'>
                            <div className='card p-4 '>
                                <div className='d-flex align-items-center mb-4'>
                                    <h5 className='mb-0 text-light'>Subtotal</h5>
                                    <h3 className='ml-auto mb-0 font-weight-bold'><span className='text-g'>{subtotal}</span></h3>
                                </div>
                                <div className='d-flex align-items-center mb-4'>
                                    <h5 className='mb-0 text-light'>Shipping</h5>
                                    <h3 className='ml-auto mb-0 font-weight-bold'><span>Free</span></h3>
                                </div>
                                <div className='d-flex align-items-center mb-4'>
                                    <h5 className='mb-0 text-light'>Estimate for</h5>
                                    <h3 className='ml-auto mb-0 font-weight-bold'>United Kingdom</h3>
                                </div>
                                <div className='d-flex align-items-center mb-4'>
                                    <h5 className='mb-0 text-light'>Total</h5>
                                    <h3 className='ml-auto mb-0 font-weight-bold'><span className='text-g'>{subtotal}</span></h3>
                                </div>
                                <br />
                                <Link href="/checkout">
                                    <Button className='btn-g btn-lg' onClick={() => context.setCartTotalAmount(subtotal)}>
                                        Proceed To CheckOut
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Cart;