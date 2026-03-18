import Link from 'next/link';

export default function Home() {
    return (
        <>
            <section className="container mt-4 mb-6">
                <div className="card text-center" style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: 'var(--space-6) var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                    <h1 className="text-2xl font-bold mb-3" style={{ fontSize: '3rem', lineHeight: 1.1, letterSpacing: '-1px' }}>
                        Print That Makes an <span style={{ color: 'var(--secondary-color)' }}>Impact.</span>
                    </h1>
                    <p className="text-lg mb-4 opacity-90 max-w-2xl mx-auto">
                        Professional grade digital printing for your business. From premium business cards to large format banners, we deliver quality at scale.
                    </p>
                    <div className="flex justify-center gap-3">
                        <Link href="/products" className="btn btn-secondary text-lg" style={{ padding: '0.75rem 2rem' }}>
                            Explore Products
                        </Link>
                    </div>
                </div>
            </section>

            <section className="container mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Popular Categories</h2>
                    <Link href="/products" className="text-primary font-semibold text-sm hover:underline">View All →</Link>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {['Business Cards', 'Flyers & Leaflets', 'Custom Mugs', 'Stickers & Labels'].map((cat, i) => (
                        <Link href="/products" key={i} className="card text-center cursor-pointer">
                            <div
                                style={{
                                    height: '140px',
                                    backgroundColor: 'var(--bg-color)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 'var(--space-3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-secondary)'
                                }}
                            >
                                [Image {i + 1}]
                            </div>
                            <h3 className="font-semibold">{cat}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            <section style={{ backgroundColor: 'white', padding: 'var(--space-6) 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container grid grid-cols-3 gap-6 text-center">
                    <div>
                        <div className="mb-3 text-primary text-2xl font-bold">⏱️ 24h</div>
                        <h4 className="font-bold text-lg mb-2">Fast Turnaround</h4>
                        <p className="text-secondary text-sm">We print and ship 90% of our orders within 24 hours of file approval.</p>
                    </div>
                    <div>
                        <div className="mb-3 text-primary text-2xl font-bold">✨ HQ</div>
                        <h4 className="font-bold text-lg mb-2">Premium Quality</h4>
                        <p className="text-secondary text-sm">State of the art digital presses ensuring crisp colors and thick, luxurious paper.</p>
                    </div>
                    <div>
                        <div className="mb-3 text-primary text-2xl font-bold">✓ 100%</div>
                        <h4 className="font-bold text-lg mb-2">Satisfaction Guarantee</h4>
                        <p className="text-secondary text-sm">If you aren't completely happy with your print, we will reprint it for free.</p>
                    </div>
                </div>
            </section>
        </>
    );
}
