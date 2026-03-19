'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="container mx-auto py-12 px-4 md:px-0 max-w-4xl">
            <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
                <div className="md:w-1/2 flex justify-center">
                    <img src="/logo.png" alt="SafoyanaPrint Logo" className="w-full max-w-sm" style={{ filter: 'drop-shadow(0px 10px 15px rgba(255,255,255,0.05))' }} />
                </div>
                <div className="md:w-1/2">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ letterSpacing: '-0.02em' }}>
                        Modern Printing <br /><span className="text-primary" style={{ color: 'var(--accent-color)' }}>Redefined.</span>
                    </h1>
                    <p className="text-lg text-secondary mb-6 leading-relaxed">
                        At SafoyanaPrint, we bridge the gap between imagination and physical reality. Built for modern businesses and creative professionals who demand the absolute best in paper quality and vibrant color printing.
                    </p>
                    <div className="flex gap-4">
                        <Link href="/products" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>Explore Products</Link>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 py-16 border-t border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
                <div className="p-6 text-center">
                    <div className="text-4xl mb-4 font-bold text-white">01</div>
                    <h3 className="text-xl font-bold mb-2">Premium Materials</h3>
                    <p className="text-secondary text-sm leading-relaxed">We source only the thickest, most durable paper stocks and highest-grade vinyls in the industry.</p>
                </div>
                <div className="p-6 text-center">
                    <div className="text-4xl mb-4 font-bold text-white">02</div>
                    <h3 className="text-xl font-bold mb-2">Unmatched Fidelity</h3>
                    <p className="text-secondary text-sm leading-relaxed">Our advanced digital presses guarantee picture-perfect CMYK reproduction and brilliant whites.</p>
                </div>
                <div className="p-6 text-center">
                    <div className="text-4xl mb-4 font-bold text-white">03</div>
                    <h3 className="text-xl font-bold mb-2">Expedited Delivery</h3>
                    <p className="text-secondary text-sm leading-relaxed">Because your time is valuable. Most orders are printed and dispatched within 24 to 48 hours.</p>
                </div>
            </div>

            <div className="py-16 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to start your project?</h2>
                <p className="text-secondary max-w-xl mx-auto mb-8">
                    Thousands of brands trust SafoyanaPrint to deliver their merchandising and stationary needs. Make an impact today.
                </p>
                <Link href="/login" className="btn btn-primary px-8 py-3 text-lg" style={{ borderRadius: 'var(--radius-full)' }}>Create an Account</Link>
            </div>
        </div>
    );
}
