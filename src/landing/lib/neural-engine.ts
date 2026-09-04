type NodeLayer = 1 | 2 | 3;

type FieldNode = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  r: number;
  base: number;
  energy: number;
  layer: NodeLayer;
  phase: number;
  speed: number;
};

type FieldLink = {
  a: number;
  b: number;
  dist: number;
};

type Pulse = {
  a: number;
  b: number;
  t: number;
  speed: number;
};

export type NeuralPointer = {
  x: number;
  y: number;
  active: boolean;
};

type NeuralOptions = {
  reducedMotion: boolean;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function gauss() {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export class NeuralField {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private nodes: FieldNode[] = [];
  private links: FieldLink[] = [];
  private pulses: Pulse[] = [];
  private raf = 0;
  private running = false;
  private dpr = 1;
  private width = 0;
  private height = 0;
  private pointer: NeuralPointer = { x: 0, y: 0, active: false };
  private scroll = 0;
  private reduced = false;
  private last = 0;
  private spawnAcc = 0;
  private rgb = "106, 83, 224";
  private resizeObserver: ResizeObserver;

  constructor(canvas: HTMLCanvasElement, options: NeuralOptions) {
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("Canvas 2D is unavailable");
    this.canvas = canvas;
    this.ctx = ctx;
    this.reduced = options.reducedMotion;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
  }

  setPointer(pointer: NeuralPointer) {
    this.pointer = pointer;
  }

  setScroll(progress: number) {
    this.scroll = clamp(progress, 0, 1);
  }

  setReducedMotion(value: boolean) {
    this.reduced = value;
  }

  setThemeFrom(element: HTMLElement) {
    const value = getComputedStyle(element)
      .getPropertyValue("--neural-rgb")
      .trim();
    if (value) this.rgb = value;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
  }

  private resize = () => {
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.rebuild();
  };

  private rebuild() {
    const mobile = this.width < 720;
    const cores = navigator.hardwareConcurrency || 4;
    let count = mobile ? 44 : 108;
    if (cores <= 4) count = Math.round(count * 0.72);
    if (this.reduced) count = Math.round(count * 0.55);

    const clusters = this.makeClusters();
    this.nodes = Array.from({ length: count }, (_, index) => {
      const cluster = clusters[index % clusters.length];
      const spread = cluster.spread * Math.min(this.width, this.height);
      const x = clamp(cluster.x + gauss() * spread * 0.38, 8, this.width - 8);
      const y = clamp(cluster.y + gauss() * spread * 0.38, 8, this.height - 8);
      const layer: NodeLayer = index % 9 === 0 ? 3 : index % 4 === 0 ? 2 : 1;
      return {
        x,
        y,
        ox: x,
        oy: y,
        vx: 0,
        vy: 0,
        r: layer === 3 ? rand(2.4, 3.6) : layer === 2 ? rand(1.6, 2.4) : rand(0.9, 1.6),
        base: layer === 3 ? rand(0.55, 0.82) : layer === 2 ? rand(0.32, 0.58) : rand(0.14, 0.32),
        energy: 0,
        layer,
        phase: rand(0, Math.PI * 2),
        speed: rand(0.18, 0.55),
      };
    });

    this.links = this.connect();
    this.pulses = [];
  }

  private makeClusters() {
    const w = this.width;
    const h = this.height;
    const originX = w * 0.62;
    const originY = h * 0.44;
    return [
      { x: originX, y: originY, spread: 0.34 },
      { x: originX + w * 0.14, y: originY - h * 0.12, spread: 0.24 },
      { x: originX - w * 0.1, y: originY + h * 0.16, spread: 0.26 },
      { x: originX + w * 0.2, y: originY + h * 0.1, spread: 0.2 },
      { x: originX - w * 0.18, y: originY - h * 0.1, spread: 0.18 },
    ];
  }

  private connect(): FieldLink[] {
    const maxDist = Math.min(this.width, this.height) * 0.16;
    const links: FieldLink[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < this.nodes.length; i += 1) {
      const distances: { j: number; d: number }[] = [];
      for (let j = 0; j < this.nodes.length; j += 1) {
        if (i === j) continue;
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const d = Math.hypot(dx, dy);
        if (d < maxDist) distances.push({ j, d });
      }
      distances.sort((a, b) => a.d - b.d);
      const take = this.nodes[i].layer === 3 ? 4 : 3;
      for (const item of distances.slice(0, take)) {
        const key = i < item.j ? `${i}-${item.j}` : `${item.j}-${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        links.push({ a: i, b: item.j, dist: item.d });
      }
    }

    return links;
  }

  private tick = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(0.033, (now - this.last) / 1000);
    this.last = now;
    this.step(dt, now / 1000);
    this.draw();
    this.raf = requestAnimationFrame(this.tick);
  };

  private step(dt: number, time: number) {
    const motion = this.reduced ? 0.08 : 1;
    const coreX = this.width * 0.5;
    const coreY = this.height * 0.52;
    const pull = this.scroll * 0.12;

    for (const node of this.nodes) {
      const driftX = Math.sin(time * node.speed + node.phase) * 6 * motion;
      const driftY = Math.cos(time * node.speed * 0.85 + node.phase) * 5 * motion;
      const targetX = node.ox * (1 - pull) + coreX * pull + driftX;
      const targetY = node.oy * (1 - pull) + coreY * pull + driftY;

      if (this.pointer.active) {
        const dx = node.x - this.pointer.x;
        const dy = node.y - this.pointer.y;
        const dist = Math.hypot(dx, dy);
        const radius = 150;
        if (dist < radius && dist > 0.001) {
          const influence = 1 - dist / radius;
          node.energy = Math.max(node.energy, influence * 0.9);
          const force = influence * 18 * motion;
          node.vx -= (dx / dist) * force * dt;
          node.vy -= (dy / dist) * force * dt;
        }
      }

      node.vx += (targetX - node.x) * 1.6 * dt;
      node.vy += (targetY - node.y) * 1.6 * dt;
      node.vx *= 0.86;
      node.vy *= 0.86;
      node.x += node.vx;
      node.y += node.vy;
      node.energy *= 0.965;
    }

    this.spawnAcc += dt;
    const interval = this.reduced ? 3.8 : 1.7;
    if (this.spawnAcc > interval && this.links.length) {
      this.spawnAcc = 0;
      const link = this.links[Math.floor(Math.random() * this.links.length)];
      this.nodes[link.a].energy = Math.max(this.nodes[link.a].energy, 1);
      this.pulses.push({
        a: link.a,
        b: link.b,
        t: 0,
        speed: this.reduced ? 0.18 : rand(0.35, 0.7),
      });
      if (this.pulses.length > 18) this.pulses.shift();
    }

    for (const pulse of this.pulses) {
      pulse.t += pulse.speed * dt;
      if (pulse.t >= 1) {
        this.nodes[pulse.b].energy = Math.max(this.nodes[pulse.b].energy, 0.85);
      }
    }
    this.pulses = this.pulses.filter((pulse) => pulse.t < 1);
  }

  private draw() {
    const { ctx, width, height, rgb, scroll } = this;
    ctx.clearRect(0, 0, width, height);
    const fade = 1 - scroll * 0.45;

    ctx.lineWidth = 1;
    for (const link of this.links) {
      const a = this.nodes[link.a];
      const b = this.nodes[link.b];
      const energy = Math.max(a.energy, b.energy);
      const alpha = (0.09 + energy * 0.28) * fade;
      ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    for (const pulse of this.pulses) {
      const a = this.nodes[pulse.a];
      const b = this.nodes[pulse.b];
      const x = a.x + (b.x - a.x) * pulse.t;
      const y = a.y + (b.y - a.y) * pulse.t;
      ctx.fillStyle = `rgba(${rgb}, ${0.55 * fade})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const node of this.nodes) {
      const alpha = (node.base + node.energy * 0.55) * fade;
      if (node.layer === 3 && node.energy > 0.15) {
        ctx.fillStyle = `rgba(${rgb}, ${0.12 * fade})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r * 5.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r + node.energy * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
