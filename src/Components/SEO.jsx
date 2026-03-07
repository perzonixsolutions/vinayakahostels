import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({ title, description, name, type, keywords, canonicalUrl }) => {
    const siteName = "Vinayaka Boys Hostel & PG";
    const defaultDescription = "Welcome to Vinayaka Boys Hostel & PG, providing comfortable and affordable accommodation with top-class facilities for students of SRM AP, Amrita AP, and VIT AP.";
    const defaultKeywords = "Boys Hostel near SRM AP, PG near Amrita University AP, Boys PG near VIT AP, Hostel in Kuragallu, PG in Neerukonda, Boys Hostel Mangalagiri, Student Accommodation Guntur, Vinayaka Boys PG";

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title ? `${title} | ${siteName}` : siteName}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />

            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph tags for social media sharing */}
            <meta property="og:type" content={type || "website"} />
            <meta property="og:title" content={title ? `${title} | ${siteName}` : siteName} />
            <meta property="og:description" content={description || defaultDescription} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name || siteName} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title ? `${title} | ${siteName}` : siteName} />
            <meta name="twitter:description" content={description || defaultDescription} />
        </Helmet>
    );
};

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    keywords: PropTypes.string,
    canonicalUrl: PropTypes.string,
};

export default SEO;
