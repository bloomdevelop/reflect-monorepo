"use client"

import * as React from 'react';
import { cn } from "@/lib/utils";

// Create a lightweight version of the avatar without context dependency
interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}

// Define the types for the Avatar components
type AvatarImageElement = React.ReactElement<AvatarImageProps>;
type AvatarFallbackElement = React.ReactElement<AvatarFallbackProps>;

const Avatar = React.memo(React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, children, ...props }, ref) => {
    const [imageStatus, setImageStatus] = React.useState<'loading' | 'error' | 'loaded'>('loading');
    
    // Clone children to pass down the loading status
    const enhancedChildren = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        // Handle AvatarImage
        if ((child as AvatarImageElement).type === AvatarImage) {
          return React.cloneElement(child as AvatarImageElement, {
            onLoadingStatusChange: setImageStatus,
            key: 'avatar-image'
          });
        }
        // Handle AvatarFallback
        if ((child as AvatarFallbackElement).type === AvatarFallback) {
          return React.cloneElement(child as AvatarFallbackElement, {
            show: imageStatus !== 'loaded',
            key: 'avatar-fallback'
          });
        }
      }
      return child;
    });
    
    return (
      <span
        ref={ref}
        data-slot="avatar"
        className={cn(
          "relative flex size-8 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        {enhancedChildren}
      </span>
    );
  }
));
Avatar.displayName = 'Avatar';

interface AvatarImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  asChild?: boolean;
  alt?: string;
  onLoadingStatusChange?: (status: 'loading' | 'error' | 'loaded') => void;
}

const AvatarImage = React.memo(React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, alt = 'User avatar', src, onLoadingStatusChange, ...rest }, ref) => {
    const [status, setStatus] = React.useState<'loading' | 'error' | 'loaded'>('loading');
    
    React.useEffect(() => {
      if (!src) {
        setStatus('error');
        onLoadingStatusChange?.('error');
      } else {
        setStatus('loading');
        onLoadingStatusChange?.('loading');
      }
    }, [src, onLoadingStatusChange]);

    const handleLoad = () => {
      setStatus('loaded');
      onLoadingStatusChange?.('loaded');
    };

    const handleError = () => {
      setStatus('error');
      onLoadingStatusChange?.('error');
    };

    // Don't render anything if there's no source
    if (!src) return null;
    
    // Only render the image if it's not in error state
    if (status === 'error') return null;
    
    return (
      <img
        ref={ref}
        data-slot="avatar-image"
        className={cn("aspect-square size-full object-cover", className)}
        alt={alt}
        src={src}
        onLoad={handleLoad}
        onError={handleError}
        {...rest}
      />
    );
  }
));
AvatarImage.displayName = 'AvatarImage';

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
  show?: boolean;
}

const AvatarFallback = React.memo(React.forwardRef<
  HTMLSpanElement,
  AvatarFallbackProps
>(({ className, show = true, ...props }, ref) => {
  if (!show) return null;
  
  return (
    <span
      ref={ref}
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
}));
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback }
