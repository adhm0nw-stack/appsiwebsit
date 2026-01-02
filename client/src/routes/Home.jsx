import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';


export default function Home() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('الكل');
    const [searchQuery, setSearchQuery] = useState('');
    const { addToCart } = useContext(CartContext);
    const { addToast } = useToast();


    useEffect(() => {
        axios.get('http://localhost:3000/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleContact = async (e) => {
        e.preventDefault();
        const name = e.target.elements[0].value;
        const text = e.target.elements[1].value;
        try {
            await axios.post('http://localhost:3000/api/messages', { name, text });
            addToast('تم إرسال رسالتك بنجاح!', 'success');
            e.target.reset();
        } catch (err) {
            addToast('فشل الإرسال', 'error');
        }
    };

    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    const handleSubscription = (e) => {
        e.preventDefault();
        setShowSubscriptionModal(false);
        addToast('تم الاشتراك بنجاح', 'success');
    };

    const categoryMap = {
        'الكل': 'الكل',
        'روايات': 'روايات',
        'تطوير الذات': 'تطوير الذات',
        'تاريخ': 'تاريخ',
        'علوم': 'علوم'
    };

    return (
        <div className="animate-fadeIn">

            {/* Hero Section */}
            <header className="relative bg-white dark:bg-secondary overflow-hidden transition-colors">
                <div className="absolute inset-0 z-0">
                    <img src="/images/hero_header.png" alt="Library Background" className="w-full h-full object-cover opacity-20 dark:opacity-30" />
                </div>

                <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center relative z-10">
                    <div className={`md:w-1/2 z-10 text-center ${true ? 'md:text-right' : 'md:text-left'} mb-10 md:mb-0`}>
                        <span className="text-primary font-bold tracking-wider uppercase mb-2 block animate-pulse">عروض خاصة للصيف</span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-secondary dark:text-white mb-6 leading-tight">
                            اكتشف عوالماً جديدة بين طيات الكتب
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-lg mx-auto md:mx-0">
                            أفضل مجموعة من الكتب العالمية والمحلية بأسعار تنافسية. توصيل سريع ومجاني للطلبات فوق 200 ريال.
                        </p>
                        <a href="#featured" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-secondary dark:hover:bg-white dark:hover:text-secondary transition shadow-lg transform hover:-translate-y-1">تصفح الكتب</a>
                    </div>
                    <div className="md:w-1/2 flex justify-center perspective-1000">
                        <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Featured Book" className="rounded-lg shadow-2xl border-4 border-white dark:border-gray-600 transform rotate-3 hover:rotate-0 transition duration-500 max-w-xs md:max-w-sm" />
                    </div>
                </div>
            </header>

            {/* Search Section */}
            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-white dark:bg-secondary p-4 rounded-lg shadow-lg max-w-2xl mx-auto flex items-center gap-4">
                    <i className="fas fa-search text-gray-400 text-xl"></i>
                    <input
                        type="text"
                        placeholder="ابحث عن كتاب أو مؤلف..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent outline-none dark:text-white text-lg"
                    />
                </div>
            </div>

            {/* Categories Chips */}
            <div id="categories" className="container mx-auto px-4 py-8 overflow-x-auto whitespace-nowrap text-center no-scrollbar">
                {Object.keys(categoryMap).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`inline-block px-6 py-2 rounded-full shadow-sm mx-2 transition cursor-pointer border text-sm md:text-base 
                            ${selectedCategory === cat
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white dark:bg-secondary dark:border-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Featured Books */}
            <section id="featured" className="py-12 bg-gray-50 dark:bg-dark-bg transition-colors">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-8">
                        <h2 className={`text-3xl font-bold text-secondary dark:text-white ${true ? 'border-r-4 pr-4' : 'border-l-4 pl-4'} border-primary`}>الكتب المميزة</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {filteredProducts.map(book => (
                            <div key={book.id} className="group bg-white dark:bg-secondary rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-primary/20">
                                <div className="relative w-full aspect-[2/3] overflow-hidden">
                                    <img src={book.img} alt={book.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
                                    <button onClick={() => addToCart(book)} className="absolute bottom-4 left-4 right-4 bg-white text-primary font-bold py-3 rounded-lg shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white">
                                        <i className="fas fa-cart-plus ml-2"></i> أضف للسلة
                                    </button>
                                    <span className={`absolute top-3 right-3 bg-secondary text-white text-xs px-2 py-1 rounded opacity-90`}>{book.category}</span>
                                </div>
                                <div className="p-5">
                                    <h3 className={`text-lg font-bold text-secondary dark:text-white mb-1 group-hover:text-primary transition text-right`}>{book.title}</h3>
                                    <div className={`flex text-yellow-500 text-xs mb-2 justify-start`}>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                    </div>
                                    <p className={`text-gray-500 dark:text-gray-400 text-sm mb-3 text-right`}>{book.author}</p>
                                    <div className="flex justify-between items-center border-t dark:border-gray-700 pt-3">
                                        <span className="font-bold text-primary text-xl">{book.price} <span className="text-xs">ر.س</span></span>
                                        <div className="flex text-yellow-400 text-xs gap-0.5">
                                            <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recommended Books */}
            <section className="py-12 bg-white dark:bg-secondary transition-colors">
                <div className="container mx-auto px-4">
                    <h2 className={`text-3xl font-bold text-secondary dark:text-white border-r-4 pr-4 border-primary mb-8`}>قد يعجبك أيضاً</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {products.slice(0, 4).reverse().map(book => (
                            <div key={`rec-${book.id}`} className="group relative">
                                <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition">
                                    <img src={book.img} alt={book.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button onClick={() => addToCart(book)} className="bg-primary text-white px-4 py-2 rounded-full font-bold transform scale-90 group-hover:scale-100 transition">
                                            <i className="fas fa-plus"></i> أضف
                                        </button>
                                    </div>
                                </div>
                                <h4 className="mt-2 font-bold dark:text-white text-sm truncate">{book.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{book.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Promo Section */}
            <section className="py-20 bg-secondary relative mt-8">
                <div className="absolute inset-0 opacity-40 rounded-lg" style={{ backgroundImage: "url('/images/library-promo.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div className={`container mx-auto px-4 relative z-10 text-center`}>
                    <div className="md:w-2/3 mx-auto">
                        <span className="bg-primary text-white px-3 py-1 text-sm font-bold rounded mb-4 inline-block">عروض حصرية</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">انضم لنادي القراء المميز</h2>
                        <p className="text-gray-300 mb-8 text-lg">احصل على خصومات تصل إلى 50% وشحن مجاني لجميع طلباتك عند الانضمام لعضويتنا الذهبية.</p>
                        <div className="relative inline-block">
                            <button onClick={() => setShowSubscriptionModal(!showSubscriptionModal)} className="bg-white text-secondary font-bold py-3 px-8 rounded-full hover:bg-primary hover:text-white transition duration-300 shadow-lg relative z-20">
                                {showSubscriptionModal ? <><i className="fas fa-times"></i> إغلاق</> : 'اشترك الآن'}
                            </button>

                            {/* Subscription Popover (Above Button) */}
                            {showSubscriptionModal && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -ml-12 mb-4 w-80 md:w-96 bg-white dark:bg-secondary p-5 rounded-xl shadow-2xl border dark:border-gray-600 text-right z-30 animate-fadeIn">
                                    {/* Arrow */}
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-secondary rotate-45 border-r border-b dark:border-gray-600"></div>

                                    <h2 className="text-lg font-bold mb-3 text-center dark:text-white text-primary">الانضمام لنادي القراء</h2>
                                    <form onSubmit={handleSubscription} className="space-y-3 relative z-10">
                                        <div>
                                            <input type="text" placeholder="اسم المشترك" required className="w-full p-2 rounded border bg-gray-50 dark:bg-zinc-700/50 dark:border-gray-600 dark:text-white text-sm outline-none focus:border-primary transition" />
                                        </div>
                                        <div className="relative">
                                            <i className="fab fa-cc-visa absolute left-3 top-2.5 text-gray-400"></i>
                                            <input type="text" placeholder="0000 0000 0000 0000" dir="ltr" required className="w-full p-2 pl-9 rounded border bg-gray-50 dark:bg-zinc-700/50 dark:border-gray-600 dark:text-white text-sm outline-none focus:border-primary transition font-mono text-left" />
                                        </div>
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="MM/YY" dir="ltr" required className="w-1/2 p-2 rounded border bg-gray-50 dark:bg-zinc-700/50 dark:border-gray-600 dark:text-white text-center text-sm outline-none focus:border-primary transition font-mono" />
                                            <input type="text" placeholder="CVC" dir="ltr" required className="w-1/2 p-2 rounded border bg-gray-50 dark:bg-zinc-700/50 dark:border-gray-600 dark:text-white text-center text-sm outline-none focus:border-primary transition font-mono" />
                                        </div>
                                        <button type="submit" className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-primary/90 transition shadow text-sm">
                                            تأكيد الاشتراك
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white dark:bg-secondary mt-8 border-t dark:border-gray-700">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <img src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Contact Us" className="rounded-xl shadow-lg" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-4 dark:text-white">تواصل معنا</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">لديك استفسار عن كتاب معين؟ أو تواجه مشكلة في الطلب؟ نحن هنا للمساعدة.</p>
                        <form onSubmit={handleContact} className="space-y-4">
                            <input type="text" placeholder="الاسم" required className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-primary outline-none" />
                            <textarea placeholder="رسالتك..." required rows="4" className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-primary outline-none"></textarea>
                            <button type="submit" className="bg-primary text-white px-8 py-3 rounded font-bold w-full hover:opacity-90 shadow-lg transition">إرسال الرسالة</button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8 text-center mt-12 text-sm">
                <p>© 2023 مكتبتي. جميع الحقوق محفوظة.</p>
            </footer>
        </div>
    );
}
