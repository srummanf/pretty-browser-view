"use client";

import type React from "react";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Minimize2,
  Info,
  Link,
  Camera,
  Globe,
  RotateCcw,
  MoreHorizontal,
  Square,
  SquareTerminal,
  Crosshair,
  Puzzle,
  Terminal,
  Maximize2
} from "lucide-react";

interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  isFullScreen: boolean;
}

type ResizeDirection = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";

export default function DesktopBrowser() {
  const [url, setUrl] = useState("https://hkhub.vercel.app/");
  const [currentUrl, setCurrentUrl] = useState("https://hkhub.vercel.app/");
  const [windowState, setWindowState] = useState<WindowState>({
    x: 100,
    y: 100,
    width: 1000,
    height: 700,
    isFullScreen: false,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>("se");
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    windowX: 0,
    windowY: 0,
  });

  const windowRef = useRef<HTMLDivElement>(null);

  const handleGo = () => {
    let processedUrl = url.trim();
    if (
      !processedUrl.startsWith("http://") &&
      !processedUrl.startsWith("https://")
    ) {
      if (
        processedUrl.includes("localhost") ||
        processedUrl.match(/^\d+\.\d+\.\d+\.\d+/)
      ) {
        processedUrl = `http://${processedUrl}`;
      } else {
        processedUrl = `https://${processedUrl}`;
      }
    }
    setCurrentUrl(processedUrl);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGo();
    }
  };

  const toggleFullScreen = () => {
    setWindowState((prev) => ({
      ...prev,
      isFullScreen: !prev.isFullScreen,
    }));
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (windowState.isFullScreen) return;

      setIsDragging(true);
      setDragStart({
        x: e.clientX - windowState.x,
        y: e.clientY - windowState.y,
      });
    },
    [windowState.x, windowState.y, windowState.isFullScreen]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, direction: ResizeDirection) => {
      if (windowState.isFullScreen) return;

      e.stopPropagation();
      setIsResizing(true);
      setResizeDirection(direction);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: windowState.width,
        height: windowState.height,
        windowX: windowState.x,
        windowY: windowState.y,
      });
    },
    [
      windowState.width,
      windowState.height,
      windowState.x,
      windowState.y,
      windowState.isFullScreen,
    ]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !windowState.isFullScreen) {
        setWindowState((prev) => ({
          ...prev,
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        }));
      }

      if (isResizing && !windowState.isFullScreen) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = resizeStart.windowX;
        let newY = resizeStart.windowY;

        // Handle different resize directions
        if (resizeDirection.includes("e")) {
          newWidth = Math.max(400, resizeStart.width + deltaX);
        }
        if (resizeDirection.includes("w")) {
          newWidth = Math.max(400, resizeStart.width - deltaX);
          newX = resizeStart.windowX + (resizeStart.width - newWidth);
        }
        if (resizeDirection.includes("s")) {
          newHeight = Math.max(300, resizeStart.height + deltaY);
        }
        if (resizeDirection.includes("n")) {
          newHeight = Math.max(300, resizeStart.height - deltaY);
          newY = resizeStart.windowY + (resizeStart.height - newHeight);
        }

        setWindowState((prev) => ({
          ...prev,
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    isResizing,
    dragStart,
    resizeStart,
    windowState.isFullScreen,
    resizeDirection,
  ]);

  const windowStyle = windowState.isFullScreen
    ? {
        position: "fixed" as const,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 50,
      }
    : {
        position: "absolute" as const,
        left: windowState.x,
        top: windowState.y,
        width: windowState.width,
        height: windowState.height,
      };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: "url('/desktop-wallpaper.jpg')",
      }}
    >
      {/* Browser Window with Glass Morphism */}
      <div
        ref={windowRef}
        className="flex flex-col overflow-hidden"
        style={{
          ...windowStyle,
          background: "rgba(0, 0, 0, 0.85)",
          borderRadius: "4px",
          boxShadow: `
  0 0 0 1px rgba(255, 255, 255, 0.1),
  0 28px 24px rgba(0, 0, 0, 0.6),   /* stronger bottom shadow */
  0 8px 16px rgba(0, 0, 0, 0.4),    /* secondary soft bottom */
  0 0 0 10px rgba(135, 206, 235, 0.3),
  0 0 0 11.5px rgba(0, 0, 0, 0.8)
`
,
        }}
      >
        {/* Glass Top Bar */}
        <div
          className="px-4 py-3 flex items-center justify-between cursor-move select-none relative"
          onMouseDown={handleMouseDown}
          style={{
            background: `
    linear-gradient(180deg, 
      rgba(60, 60, 60, 0.95) 0%, 
      rgba(40, 40, 40, 0.95) 30%, 
      rgba(25, 25, 25, 0.95) 70%, 
      rgba(15, 15, 15, 0.95) 100%
    )
  `,
            backdropFilter: "blur(25px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "6px 6px 0 0",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Left side - Info icon and URL */}
          <div className="flex items-center space-x-3 flex-1">
            <Info className="h-4 w-4 text-white/70" />
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={handleGo}
              className="px-3 py-1 rounded-md text-sm text-white/90 font-mono bg-black/20 border border-white/10 focus:bg-black/30 focus:border-white/20 focus:outline-none"
              style={{
                backdropFilter: "blur(10px)",
                minWidth: "200px",
                maxWidth: "400px",
              }}
            />
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
            >
              <Link className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
            >
              <Camera className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
            >
              <SquareTerminal className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
            >
              <Globe className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
            >
              <Crosshair className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
            >
              <Puzzle className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullScreen}
              className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
            >
              {windowState.isFullScreen ? (
                <Minimize2 className="h-3 w-3" />
              ) : (
                <Maximize2 className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Address Bar */}

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden">
          <iframe
            src={currentUrl}
            className="w-full h-full border-0"
            title="Browser Content"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </div>

        {/* Resize Handles - All 4 corners and sides */}
        {!windowState.isFullScreen && (
          <>
            {/* Corner handles */}
            <div
              className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "nw")}
            />
            <div
              className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "ne")}
            />
            <div
              className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "sw")}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "se")}
            />

            {/* Edge handles */}
            {/* Left */}
            <div
              className="absolute top-0 left-3 right-3 h-1 cursor-n-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "n")}
            />
            <div
              className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "s")}
            />
            <div
              className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "w")}
            />
            <div
              className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, "e")}
            />

            {/* Visual resize indicator in bottom-right */}
            <div className="absolute bottom-1 right-1 w-3 h-3 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-white/30"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
