export function ProductImage({ imgUrl, alt }) {
    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-[4/5]">
                {imgUrl ? (
                    <img
                        src={imgUrl}
                        alt={alt}
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                        Image Not Available
                    </div>
                )}
            </div>
        </div>
    );
}
