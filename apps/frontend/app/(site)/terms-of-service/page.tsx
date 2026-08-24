export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
                    <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>
                    <div className="prose prose-slate max-w-none text-slate-600">
                        <p className="mb-6">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                        
                        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">1. Acceptance of Terms</h2>
                        <p className="mb-4">
                            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </p>
                        <p className="mb-4">
                            Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.
                        </p>

                        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">2. Intellectual Property Rights</h2>
                        <p className="mb-4">
                            Unless otherwise stated, OceanLK Holdings and/or its licensors own the intellectual property rights for all material on the website. All intellectual property rights are reserved. You may access this from OceanLK Holdings for your own personal use subjected to restrictions set in these terms and conditions.
                        </p>
                        <p className="mb-4">
                            You must not:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>Republish material from OceanLK Holdings</li>
                            <li>Sell, rent or sub-license material from OceanLK Holdings</li>
                            <li>Reproduce, duplicate or copy material from OceanLK Holdings</li>
                            <li>Redistribute content from OceanLK Holdings</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">3. Disclaimer</h2>
                        <p className="mb-4">
                            To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>limit or exclude our or your liability for death or personal injury;</li>
                            <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                            <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                            <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">4. Revisions and Errata</h2>
                        <p className="mb-4">
                            The materials appearing on OceanLK Holdings's website could include technical, typographical, or photographic errors. OceanLK Holdings does not warrant that any of the materials on its website are accurate, complete or current. OceanLK Holdings may make changes to the materials contained on its website at any time without notice.
                        </p>

                        <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">5. Governing Law</h2>
                        <p className="mb-4">
                            These terms and conditions are governed by and construed in accordance with the laws of Sri Lanka and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
