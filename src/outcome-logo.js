// Four polygons traced from the supplied craftertech-black.svg (546 × 545).
const polygons=[
 [[545.5,0],[545.5,182],[364.5,181],[182,0]],
 [[181.5,0],[181.5,362.5],[0,362.5],[0,181]],
 [[182,362],[361,542.5],[182,542.5],[0.5,362]],
 [[364,362.5],[545.5,544.5],[545.5,362.5],[364,182]],
];
export const logoContours=Array.from({length:19},(_,layer)=>polygons.map(polygon=>({
 points:polygon.map(([x,y])=>[x-273,y-272.5,(layer-9)*7]),
 closed:true,face:layer===18,
}))).flat();
// Join front and back vertices so the wireframe reads as one solid mark.
export const logoEdges=polygons.flatMap(polygon=>polygon.map(([x,y])=>({points:[[x-273,y-272.5,-63],[x-273,y-272.5,63]],closed:false})));
export const logoMesh=[...logoContours,...logoEdges];
export function projectLogoPath(shape,time=0){
 // Bounded tilts preserve the recognisable logo throughout the motion.
 const ax=-.12+Math.sin(time*.24)*.16,ay=.22+Math.sin(time*.19)*.28,az=-.07+Math.sin(time*.16)*.07;
 const floatY=Math.sin(time*.35)*12;
 return shape.points.map(([x,y,z],i)=>{
  const yy=y*Math.cos(ax)-z*Math.sin(ax),zz=y*Math.sin(ax)+z*Math.cos(ax);
  const xx=x*Math.cos(ay)+zz*Math.sin(ay),depth=-x*Math.sin(ay)+zz*Math.cos(ay);
  const px=xx*Math.cos(az)-yy*Math.sin(az),py=xx*Math.sin(az)+yy*Math.cos(az);
  const perspective=1500/(1500+depth);
  return `${i?'L':'M'}${(450+px*perspective).toFixed(2)},${(430+py*perspective+floatY).toFixed(2)}`;
 }).join(' ')+(shape.closed?'Z':'');
}
