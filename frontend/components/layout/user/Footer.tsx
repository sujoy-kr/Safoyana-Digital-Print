import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer style={{ backgroundColor: '#1E293B', color: 'white', padding: '3rem 0', marginTop: 'auto' }}>
            <div className="container grid grid-cols-3 gap-4">
                <div>
                    <h3 className="font-bold text-xl mb-2">SafoyanaPrint.</h3>
                    <p className="text-sm text-secondary" style={{ color: '#94A3B8' }}>High quality digital print solutions tailored for your business needs.</p>
                </div>
                <div>
                    <h4 className="font-bold mb-2">Products</h4>
                    <ul className="flex-col gap-2 text-sm text-secondary" style={{ color: '#94A3B8', listStyle: 'none', padding: 0 }}>
                        <li>Business Cards</li>
                        <li>Flyers & Posters</li>
                        <li>Custom Mugs</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-2">Contact</h4>
                    <p className="text-sm text-secondary" style={{ color: '#94A3B8' }}>support@safoyanaprint.com<br />+1 234 567 890</p>
                </div>
            </div>
        </footer>
    );
};
