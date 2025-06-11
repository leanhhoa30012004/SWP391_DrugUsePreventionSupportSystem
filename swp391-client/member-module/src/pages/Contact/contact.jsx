import React from 'react';
import './Contact.css';
import mapImage from '../../assets/map.svg';
import logoWeHope from '../../assets/logo-wehope.png';
import Navbar from '../../components/Navbar/Navbar';
import emaillogo from '../../assets/emaillogo.svg';
import phonelogo from '../../assets/phonelogo.svg';

const Contact = () => {
    return (
        <div className="contact-page">
            <Navbar />

            <section className="contact-header">
                <div className="contact-header-content">
                    <div className="contact-left">
                        <h1>Need A Direct Line?</h1>
                        <p>
                            WeHope welcome your feedback and inquiries. Please feel free to contact us using the information below, or follow us on our social media.
                        </p>
                        <div className="contact-info">
                            <div className="info-item">
                                <img src={phonelogo} alt="Phone" className="info-icon" />
                                <div className="info-content">
                                    <span className="info-label">Phone</span>
                                    <span className="info-value">(123) 456 7890</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <img src={emaillogo} alt="Email" className="info-icon" />
                                <div className="info-content">
                                    <span className="info-label">Email</span>
                                    <span className="info-value">WeHope.organization@fpt.net.vn</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="contact-right">
                        <div className="map-container">
                            <img src={mapImage} alt="Map" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="contact-form">
                <h1>Contact Us</h1>
                <p>Your email address will not be published. Required fields are marked *</p>
                <form>
                    <div className="form-group">
                        <input type="text" placeholder="Name*" />
                        <input type="email" placeholder="Email*" />
                    </div>
                    <div className="form-group">
                        <textarea placeholder="Comment"></textarea>
                    </div>
                    <div className="form-group checkbox-group">
                        <input type="checkbox" id="save-info" />
                        <label htmlFor="save-info">Save my name, email in this browser for the next time I comment</label>
                    </div>
                    <button type="submit" className="post-comment-btn">Posts Comment</button>
                </form>
            </section>

            <section className="footer-container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <img src={logoWeHope} alt="WeHope Logo" />
                    </div>

                    <div className="footer-contact-info">
                        <div className="contact-details">
                            <h3>Contact Information</h3>
                            <p>WeHope, TP.Hồ Chí Minh</p>
                            <p>Phone: +849337748231, +84912384773</p>
                            <p>Email: WeHope.organization@fpt.net.vn</p>
                            <p>Fax: 02518680375</p>
                        </div>
                        <div className="quick-links">
                            <h3>Quick Links</h3>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">What We Do</a></li>
                                <li><a href="#">Get Involved</a></li>
                                <li><a href="#">News And Events</a></li>
                                <li><a href="#">Contact Us</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="site-footer">
                <p>Copyright 2025. All Rights Reserved by Tung Tung Tung Sahur</p>
            </footer>
        </div>
    );
};

export default Contact;