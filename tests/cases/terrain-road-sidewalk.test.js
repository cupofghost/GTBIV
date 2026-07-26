// OP2-A road/sidewalk visual integrity. These checks use a fixed world seed and
// inspect the real BufferGeometry/InstancedMesh data built by index.html.
module.exports = {
  cases: [
    {
      name: 'seeded road markings and sidewalks conform vertex-by-vertex to groundH',
      query: '?dev=1&skipintro=1&seed=20260726',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const audit = mesh => {
            const p = mesh.geometry.getAttribute('position');
            const o = mesh.geometry.getAttribute('terrainOffset');
            let worst = 0, at = null;
            for (let i = 0; i < p.count; i++) {
              const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
              const d = Math.abs(y - groundH(x, z) - o.getX(i));
              if (d > worst) { worst = d; at = [x, y, z, o.getX(i)]; }
            }
            return { vertices: p.count, worst, at };
          };
          const road = audit(ROAD_MARKINGS.coreMesh);
          const edges = audit(ROAD_MARKINGS.edgeMesh);
          const sidewalk = audit(SIDEWALK_VISUALS.mesh);
          const dashLengths = ROAD_MARKINGS.straightDashes.map(d => d.end - d.start);
          const coastLengths = ROAD_MARKINGS.coastDashes.map(d => (d.end - d.start) * (H + 7));
          const expectedSidewalkVertices = SIDEWALK_VISUALS.spots.length *
            (Math.ceil(SIDEWALK_VISUALS.length / SIDEWALK_VISUALS.maxSegment) + 1) * 4;

          // Find an undecorated point on a curb line and cross it through the
          // real static resolver. The visual sidewalk must not move the probe.
          let crossing = null;
          for (const s of SIDEWALK_VISUALS.spots) {
            for (let along = -SIDEWALK_VISUALS.length / 2 + 2; along <= SIDEWALK_VISUALS.length / 2 - 2; along += 4) {
              const x = s.axis ? s.x : s.x + along;
              const z = s.axis ? s.z + along : s.z;
              if (staticBlockerHit(x, z, 0.12)) continue;
              const probe = { x, z }, before = { x, z };
              resolveStaticFootCollision(probe, 0.12);
              crossing = Math.hypot(probe.x - before.x, probe.z - before.z);
              break;
            }
            if (crossing !== null) break;
          }
          return {
            road, edges, sidewalk, crossing,
            dashCount: dashLengths.length,
            dashMin: Math.min(...dashLengths), dashMax: Math.max(...dashLengths),
            coastMin: Math.min(...coastLengths), coastMax: Math.max(...coastLengths),
            centerWidth: ROAD_MARKINGS.centerWidth,
            edgeWidth: ROAD_MARKINGS.edgeWidth,
            gap: ROAD_MARKINGS.dashGap,
            sidewalkSpots: SIDEWALK_VISUALS.spots.length,
            sidewalkVertices: sidewalk.vertices,
            expectedSidewalkVertices,
            maxSegment: SIDEWALK_VISUALS.maxSegment,
            nonColliding: ROAD_MARKINGS.coreMesh.userData.nonColliding === true &&
              SIDEWALK_VISUALS.mesh.userData.nonColliding === true,
          };
        });
        assert(r.road.vertices > 1000 && r.edges.vertices > 1000,
          'expected combined world-scale road geometry, got ' + JSON.stringify(r));
        assert(r.sidewalkSpots > 100 && r.sidewalkVertices === r.expectedSidewalkVertices,
          'sidewalk strips were not segmented consistently: ' + JSON.stringify(r));
        assert(r.road.worst < 0.002 && r.edges.worst < 0.002 && r.sidewalk.worst < 0.002,
          'a road/sidewalk vertex does not conform to groundH: ' + JSON.stringify(r));
        assert(Math.abs(r.dashMin - 3.2) < 0.001 && Math.abs(r.dashMax - 3.2) < 0.001 &&
          Math.abs(r.coastMin - 3.2) < 0.001 && Math.abs(r.coastMax - 3.2) < 0.001,
          'dash length changed with road/camera scale: ' + JSON.stringify(r));
        assert(r.centerWidth >= 0.13 && r.centerWidth <= 0.18 &&
          r.edgeWidth >= 0.09 && r.edgeWidth <= 0.13 && r.gap >= 5,
          'road marking dimensions are outside believable world scale: ' + JSON.stringify(r));
        assert(r.maxSegment <= 4 && r.crossing !== null && r.crossing < 0.0001 && r.nonColliding,
          'sidewalks must remain segmented visual-only geometry: ' + JSON.stringify(r));
      },
    },
    {
      name: 'seeded manholes use one believable terrain-oriented instanced kit',
      query: '?dev=1&skipintro=1&seed=20260726',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const matrix = new THREE.Matrix4(), p = new THREE.Vector3(), q = new THREE.Quaternion();
          const scale = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
          let worstSeat = 0, worstNormal = 0;
          for (let i = 0; i < MANHOLE_SPOTS.length; i++) {
            const mh = MANHOLE_SPOTS[i], normal = groundNormalAt(mh.x, mh.z);
            MANHOLE_VISUALS.rim.getMatrixAt(i, matrix);
            matrix.decompose(p, q, scale);
            const expected = new THREE.Vector3(mh.x, groundH(mh.x, mh.z), mh.z).addScaledVector(normal, 0.045);
            worstSeat = Math.max(worstSeat, p.distanceTo(expected));
            worstNormal = Math.max(worstNormal, 1 - up.clone().applyQuaternion(q).dot(normal));
          }
          return {
            spots: MANHOLE_SPOTS.length,
            rims: MANHOLE_VISUALS.rim.count,
            lids: MANHOLE_VISUALS.lid.count,
            patterns: MANHOLE_VISUALS.pattern.count,
            grooves: MANHOLE_VISUALS.grooves.count,
            outerRadius: MANHOLE_VISUALS.outerRadius,
            lidRadius: MANHOLE_VISUALS.lidRadius,
            sedanWidth: CARTYPES.sedan.w,
            worstSeat, worstNormal,
            nonColliding: [MANHOLE_VISUALS.rim, MANHOLE_VISUALS.lid,
              MANHOLE_VISUALS.pattern, MANHOLE_VISUALS.grooves]
              .every(mesh => mesh.userData.nonColliding === true),
          };
        });
        assert(r.spots === 26 && r.rims === r.spots && r.lids === r.spots &&
          r.patterns === r.spots && r.grooves === r.spots * 2,
          'manhole kit is not consistently instanced: ' + JSON.stringify(r));
        assert(r.outerRadius >= 0.42 && r.outerRadius <= 0.52 &&
          r.lidRadius < r.outerRadius && r.outerRadius * 2 < r.sedanWidth * 0.6,
          'manhole cover is oversized or lacks an inset lid: ' + JSON.stringify(r));
        assert(r.worstSeat < 0.0001 && r.worstNormal < 0.0001,
          'a manhole does not follow its local terrain plane: ' + JSON.stringify(r));
        assert(r.nonColliding, 'manhole meshes must remain visual-only: ' + JSON.stringify(r));
      },
    },
  ],
};
