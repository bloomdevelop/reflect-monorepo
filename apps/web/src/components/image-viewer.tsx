"use client";

import {
	ChevronLeft,
	ChevronRight,
	Download,
	Maximize,
	Minimize,
	RefreshCw,
	RotateCw,
	X,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageInfo {
	url: string;
	filename: string;
}

interface EnhancedImageViewerProps {
	images: ImageInfo[];
	initialIndex?: number;
	isOpen: boolean;
	onOpenChange?: (isOpen: boolean) => void;
}

export function ImageViewer({
	images = [],
	initialIndex = 0,
	isOpen,
	onOpenChange,
}: EnhancedImageViewerProps) {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const safeIndex =
		Number.isInteger(currentIndex) &&
		currentIndex >= 0 &&
		currentIndex < images.length
			? currentIndex
			: 0;
	const currentImage = images[safeIndex] || { url: "", filename: "" };
	const { url: imageUrl, filename: fileName } = currentImage;

	const onClose = useCallback(() => {
		onOpenChange?.(false);
	}, [onOpenChange]);
	const [zoomLevel, setZoomLevel] = useState(1);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [loading, setLoading] = useState(true);
	const [rotation, setRotation] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const viewportRef = useRef<HTMLDivElement>(null);

	// Reset state when image changes
	useEffect(() => {
		setZoomLevel(1);
		setPosition({ x: 0, y: 0 });
		setRotation(0);
		setLoading(true);
	}, []);

	// Handle mouse wheel zoom with dynamic anchor point
	const handleWheel = useCallback(
		(e: WheelEvent) => {
			e.preventDefault();

			// Determine zoom direction and amount
			const delta = -Math.sign(e.deltaY) * 0.1;
			const newZoom = Math.max(0.5, Math.min(5, zoomLevel + delta));

			if (newZoom !== zoomLevel) {
				// Get viewport and image dimensions
				const viewport = viewportRef.current?.getBoundingClientRect();
				const image = imageRef.current?.getBoundingClientRect();

				if (!viewport || !image) {
					setZoomLevel(newZoom);
					return;
				}

				// Calculate the mouse position relative to the viewport center
				const viewportCenterX = viewport.width / 2;
				const viewportCenterY = viewport.height / 2;

				// Calculate the mouse position relative to the image
				const mouseX = (e as WheelEvent).clientX - viewport.left;
				const mouseY = (e as WheelEvent).clientY - viewport.top;

				// Calculate the offset from viewport center
				const offsetX = mouseX - viewportCenterX;
				const offsetY = mouseY - viewportCenterY;

				// Calculate how the current position should change based on zoom change
				const zoomRatio = newZoom / zoomLevel;

				// Calculate new position that keeps the point under the mouse in the same relative position
				const newX = position.x - offsetX * (zoomRatio - 1);
				const newY = position.y - offsetY * (zoomRatio - 1);

				setZoomLevel(newZoom);
				setPosition({ x: newX, y: newY });
			}
		},
		[zoomLevel, position],
	);

	// Handle mouse drag for panning
	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			if (zoomLevel <= 1) return;

			e.preventDefault();
			setIsDragging(true);
			setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
		},
		[zoomLevel, position],
	);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging) return;

			const newX = e.clientX - dragStart.x;
			const newY = e.clientY - dragStart.y;

			setPosition({ x: newX, y: newY });
		},
		[isDragging, dragStart],
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	// Add and remove event listeners
	useEffect(() => {
		const container = containerRef.current;
		if (!container || !isOpen) return;

		container.addEventListener("wheel", handleWheel, { passive: false });
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);

		return () => {
			container.removeEventListener("wheel", handleWheel);
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isOpen, handleWheel, handleMouseMove, handleMouseUp]);

	// Prevent body scrolling when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpen]);

	// Handle fullscreen
	const toggleFullscreen = useCallback(() => {
		if (!document.fullscreenElement) {
			containerRef.current?.requestFullscreen().catch((err) => {
				console.error(`Error attempting to enable fullscreen: ${err.message}`);
			});
			setIsFullscreen(true);
		} else {
			document.exitFullscreen();
			setIsFullscreen(false);
		}
	}, []);

	// Reset view
	const resetView = useCallback(() => {
		setZoomLevel(1);
		setPosition({ x: 0, y: 0 });
		setRotation(0);
	}, []);

	// Handle zoom buttons with dynamic anchor
	const handleZoomIn = useCallback(() => {
		const newZoom = Math.min(zoomLevel + 0.25, 5);

		if (newZoom !== zoomLevel) {
			// When using buttons, zoom toward the center of the current view
			const zoomRatio = newZoom / zoomLevel;

			// If we're already panned, adjust the position to maintain relative center
			if (position.x !== 0 || position.y !== 0) {
				const newX = position.x * zoomRatio;
				const newY = position.y * zoomRatio;
				setPosition({ x: newX, y: newY });
			}

			setZoomLevel(newZoom);
		}
	}, [zoomLevel, position]);

	const handleZoomOut = useCallback(() => {
		const newZoom = Math.max(zoomLevel - 0.25, 0.5);

		if (newZoom !== zoomLevel) {
			// When using buttons, zoom toward the center of the current view
			const zoomRatio = newZoom / zoomLevel;

			// If we're already panned, adjust the position to maintain relative center
			if (position.x !== 0 || position.y !== 0) {
				const newX = position.x * zoomRatio;
				const newY = position.y * zoomRatio;
				setPosition({ x: newX, y: newY });
			}

			setZoomLevel(newZoom);
		}
	}, [zoomLevel, position]);

	// Handle keyboard shortcuts
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case "Escape":
					onClose();
					break;
				case "+":
					handleZoomIn();
					break;
				case "-":
					handleZoomOut();
					break;
				case "r":
					setRotation((prev) => (prev + 90) % 360);
					break;
				case "f":
					toggleFullscreen();
					break;
				case "0":
					resetView();
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		isOpen,
		onClose,
		handleZoomIn,
		handleZoomOut,
		toggleFullscreen,
		resetView,
	]);

	// Listen for fullscreen change
	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () =>
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
	}, []);

	// Handle rotation
	const handleRotate = () => {
		setRotation((prev) => (prev + 90) % 360);
	};

	// Handle previous image
	const handlePrevious = useCallback(() => {
		setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
	}, [images.length]);

	// Handle next image
	const handleNext = useCallback(() => {
		setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
	}, [images.length]);

	if (!isOpen || !images.length) return null;

	return (
		<div className="fixed inset-0 !z-[9999] bg-background/90 backdrop-blur-sm flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b bg-background/80">
				<div className="flex items-center gap-4">
					{images.length > 1 && (
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								onClick={handlePrevious}
								disabled={images.length <= 1}
								className="h-8 w-8"
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<span className="text-sm">
								{currentIndex + 1} / {images.length}
							</span>
							<Button
								variant="outline"
								size="icon"
								onClick={handleNext}
								disabled={images.length <= 1}
								className="h-8 w-8"
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					)}
					<h2 className="text-lg font-medium truncate max-w-[200px] md:max-w-[400px]">
						{fileName}
					</h2>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="icon"
						onClick={handleZoomOut}
						disabled={zoomLevel <= 0.5}
					>
						<ZoomOut className="h-4 w-4" />
						<span className="sr-only">Zoom Out</span>
					</Button>
					<span className="text-sm px-2">{Math.round(zoomLevel * 100)}%</span>
					<Button
						variant="outline"
						size="icon"
						onClick={handleZoomIn}
						disabled={zoomLevel >= 5}
					>
						<ZoomIn className="h-4 w-4" />
						<span className="sr-only">Zoom In</span>
					</Button>
					<Button variant="outline" size="icon" onClick={handleRotate}>
						<RotateCw className="h-4 w-4" />
						<span className="sr-only">Rotate</span>
					</Button>
					<Button variant="outline" size="icon" onClick={resetView}>
						<RefreshCw className="h-4 w-4" />
						<span className="sr-only">Reset</span>
					</Button>
					<Button variant="outline" size="icon" onClick={toggleFullscreen}>
						{isFullscreen ? (
							<Minimize className="h-4 w-4" />
						) : (
							<Maximize className="h-4 w-4" />
						)}
						<span className="sr-only">
							{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
						</span>
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => window.open(imageUrl, "_blank")}
					>
						<Download className="h-4 w-4" />
						<span className="sr-only">Download</span>
					</Button>
					<Button variant="outline" size="icon" onClick={onClose}>
						<X className="h-4 w-4" />
						<span className="sr-only">Close</span>
					</Button>
				</div>
			</div>

			{/* Image Container */}
			<div
				ref={containerRef}
				className={cn(
					"flex-1 overflow-hidden relative bg-background/30",
					zoomLevel > 1 ? "cursor-grab" : "cursor-default",
					isDragging && "cursor-grabbing",
				)}
			>
				{/* Navigation arrows */}
				{images.length > 1 && (
					<>
						<button
							type="button"
							onClick={handlePrevious}
							className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/50 hover:bg-background/80 border border-border transition-colors backdrop-blur-sm shadow"
							aria-label="Previous image"
						>
							<ChevronLeft className="h-6 w-6" />
						</button>
						<button
							type="button"
							onClick={handleNext}
							className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/50 hover:bg-background/80 border border-border transition-colors backdrop-blur-sm shadow"
							aria-label="Next image"
						>
							<ChevronRight className="h-6 w-6" />
						</button>
					</>
				)}

				{/* Loading indicator */}
				{loading && (
					<div className="absolute inset-0 flex items-center justify-center z-10">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
					</div>
				)}

				{/* Image */}
				<div
					ref={viewportRef}
					className="w-full h-full flex items-center justify-center"
				>
					<div
						className="relative transition-transform duration-100 ease-out"
						style={{
							transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
							transformOrigin: "center",
							willChange: "transform",
						}}
					>
						{/** biome-ignore lint/performance/noImgElement: Since it's a image viewer it shouldn't have a single issue. */}
						<img
							ref={imageRef}
							src={imageUrl || "/placeholder.svg"}
							alt={fileName}
							className="max-h-[calc(100vh-120px)] max-w-full object-contain select-none"
							onLoad={() => setLoading(false)}
							onMouseDown={handleMouseDown}
							draggable={false}
						/>
					</div>
				</div>
			</div>

			{/* Instructions */}
			<div className="p-2 text-xs text-center text-muted-foreground bg-background/80 border-t">
				<p>
					{images.length > 1 && "← → to navigate • "}
					Mouse wheel to zoom • Click and drag to pan • R to rotate • F for
					fullscreen • 0 to reset • Esc to close
				</p>
			</div>
		</div>
	);
}
