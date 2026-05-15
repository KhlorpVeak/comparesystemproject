import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, Check, Download, Info } from 'lucide-react';
import Header from "../components/common/Header";

const ListComparePage = () => {
    const [listA, setListA] = useState('');
    const [listB, setListB] = useState('');
    const [method, setMethod] = useState('diffA');
    const [settings, setSettings] = useState({
        trim: true,
        caseSensitive: false,
        sort: true,
    });
    const [copySuccess, setCopySuccess] = useState(false);

    const results = useMemo(() => {
        const parse = (text: string) => {
            let items = text.split('\n')
                .map(i => settings.trim ? i.trim() : i)
                .filter(i => i.length > 0);

            return items;
        };

        const a = parse(listA);
        const b = parse(listB);

        const normalize = (val: string) => settings.caseSensitive ? val : val.toLowerCase();

        const setA = new Set(a.map(normalize));
        const setB = new Set(b.map(normalize));

        let res: string[] = [];

        if (method === 'diffA') {
            res = a.filter(item => !setB.has(normalize(item)));
            // Deduplicate
            const seen = new Set();
            res = res.filter(item => {
                const n = normalize(item);
                if (seen.has(n)) return false;
                seen.add(n);
                return true;
            });
        } else if (method === 'diffB') {
            res = b.filter(item => !setA.has(normalize(item)));
            // Deduplicate
            const seen = new Set();
            res = res.filter(item => {
                const n = normalize(item);
                if (seen.has(n)) return false;
                seen.add(n);
                return true;
            });
        } else if (method === 'intersect') {
            res = a.filter(item => setB.has(normalize(item)));
            // Remove duplicates from intersection
            const seen = new Set();
            res = res.filter(item => {
                const n = normalize(item);
                if (seen.has(n)) return false;
                seen.add(n);
                return true;
            });
        } else if (method === 'symmetric') {
            const onlyA = a.filter(item => !setB.has(normalize(item)));
            const onlyB = b.filter(item => !setA.has(normalize(item)));
            const combined = [...onlyA, ...onlyB];
            const seen = new Set();
            res = combined.filter(item => {
                const n = normalize(item);
                if (seen.has(n)) return false;
                seen.add(n);
                return true;
            });
        }

        if (settings.sort) {
            res.sort((x, y) => x.localeCompare(y));
        }

        return res;
    }, [listA, listB, method, settings]);

    const handleCopy = () => {
        if (results.length === 0) return;
        navigator.clipboard.writeText(results.join('\n'));
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleDownload = () => {
        if (results.length === 0) return;
        const element = document.createElement("a");
        const file = new Blob([results.join('\n')], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `comparison_results_${method}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="flex-1 overflow-auto relative z-10 bg-gray-900 text-gray-100">
            <Header title="List Compare" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* Input A */}
                    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-indigo-400">List A</h2>
                            <span className="text-xs text-gray-400 font-mono">{listA.split('\n').filter(i => i.trim()).length} lines</span>
                        </div>
                        <textarea
                            value={listA}
                            onChange={(e) => setListA(e.target.value)}
                            placeholder="Paste list A items here..."
                            className="w-full h-64 bg-gray-900 border border-gray-600 rounded-lg p-4 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none font-mono text-sm"
                        />
                    </div>

                    {/* Input B */}
                    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-purple-400">List B</h2>
                            <span className="text-xs text-gray-400 font-mono">{listB.split('\n').filter(i => i.trim()).length} lines</span>
                        </div>
                        <textarea
                            value={listB}
                            onChange={(e) => setListB(e.target.value)}
                            placeholder="Paste list B items here..."
                            className="w-full h-64 bg-gray-900 border border-gray-600 rounded-lg p-4 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none font-mono text-sm"
                        />
                    </div>
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 shadow-xl flex flex-wrap items-center gap-6"
                >
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-400">Comparison Mode</label>
                        <div className="flex bg-gray-900 p-1 rounded-lg">
                            {[
                                { id: 'diffA', label: 'Only in A' },
                                { id: 'diffB', label: 'Only in B' },
                                { id: 'intersect', label: 'In Both' },
                                { id: 'symmetric', label: 'Distinct' },
                            ].map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setMethod(m.id)}
                                    className={`px-4 py-2 rounded-md transition-all text-sm ${method === m.id
                                            ? 'bg-indigo-600 text-white shadow-lg'
                                            : 'text-gray-400 hover:text-gray-200'
                                        }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-400">Processing</label>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSettings(s => ({ ...s, trim: !s.trim }))}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${settings.trim ? 'bg-indigo-600' : 'bg-gray-700'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${settings.trim ? 'translate-x-5' : ''}`} />
                                </button>
                                <span className="text-sm text-gray-300">Trim</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSettings(s => ({ ...s, caseSensitive: !s.caseSensitive }))}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${settings.caseSensitive ? 'bg-indigo-600' : 'bg-gray-700'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${settings.caseSensitive ? 'translate-x-5' : ''}`} />
                                </button>
                                <span className="text-sm text-gray-300">Case Sensitive</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSettings(s => ({ ...s, sort: !s.sort }))}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${settings.sort ? 'bg-indigo-600' : 'bg-gray-700'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${settings.sort ? 'translate-x-5' : ''}`} />
                                </button>
                                <span className="text-sm text-gray-300">Sort</span>
                            </div>
                        </div>
                    </div>

                    <div className="ml-auto flex gap-3">
                        <button
                            onClick={() => { setListA(''); setListB(''); }}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-red-600/20 text-gray-300 hover:text-red-400 border border-gray-600 hover:border-red-600/50 rounded-lg transition-all"
                            title="Clear All"
                        >
                            <Trash2 size={18} />
                            Reset
                        </button>
                    </div>
                </motion.div>

                {/* Results Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 shadow-xl"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-white">
                                Results
                            </h2>
                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-mono font-bold border border-indigo-500/20">
                                {results.length} unique items
                            </span>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={handleCopy}
                                disabled={results.length === 0}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-all border font-medium ${copySuccess
                                        ? 'bg-green-500/10 text-green-400 border-green-500/50'
                                        : 'bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                    }`}
                            >
                                {copySuccess ? <Check size={18} /> : <Copy size={18} />}
                                {copySuccess ? 'Copied' : 'Copy'}
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={results.length === 0}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download size={18} />
                                Export
                            </button>
                        </div>
                    </div>

                    <div className="w-full bg-gray-900/50 rounded-lg p-4 border border-gray-700 max-h-[500px] overflow-auto">
                        {results.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                <AnimatePresence mode="popLayout">
                                    {results.map((item, idx) => (
                                        <motion.div
                                            key={`${item}-${idx}`}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="p-3 bg-gray-800/40 border border-gray-700/50 rounded-lg text-gray-300 flex items-center justify-between group hover:bg-gray-700/50 hover:border-indigo-500/30 transition-all font-mono text-sm"
                                        >
                                            <span className="truncate pr-2">{item}</span>
                                            <span className="text-[10px] text-gray-600 font-mono group-hover:text-indigo-400 transition-colors">{(idx + 1).toString().padStart(2, '0')}</span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-gray-600">
                                <div className="p-4 bg-gray-800 rounded-full mb-4 border border-gray-700">
                                    <Info size={32} className="opacity-40" />
                                </div>
                                <p className="text-lg font-medium">Ready for comparison</p>
                                <p className="text-sm max-w-xs text-center mt-1">Paste your lists in the areas above to see the magic happen.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default ListComparePage;
