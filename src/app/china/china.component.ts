import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as geo from 'd3-geo';
import * as d3 from 'd3';
import * as d3Color from 'd3-scale-chromatic';
import {geoConst} from '../geo.const';

@Component({
    selector: 'app-d3-china',
    templateUrl: './china.component.html',
    styleUrls: ['./china.component.scss']
})
export class ChinaComponent implements OnInit, AfterViewInit {
    chinaJsonFile: string = geoConst.v2.china;
    provincePath: string = geoConst.v2.provincePath;
    svg: any;
    projection: any;
    path: any;

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.init().then();

    }

    async init() {
        this.svg = d3.select('#svg');
        console.log(this.svg.node());
        const style = getComputedStyle(this.svg.node());
        const width = parseInt(style.getPropertyValue('width'), 10);
        const height = parseInt(style.getPropertyValue('height'), 10);
        this.projection = geo.geoMercator()
            .scale(1850)
            .center([105, 38])
            .translate([width / 2, height / 2]);

        this.path = geo.geoPath(this.projection);
        await this.getAllProvince();
        await this.getChinaMap();
    }

    addText() {
        this.svg.selectAll('g')
            .append('text')
            .attr('font-size', 12)
            .attr('text-anchor', 'middle')
            .attr('x', d => {
                // @ts-ignore
                const position = this.projection(d.properties.centroid || [0, 0]);
                return position[0];
            })
            .attr('y', d => {
                // @ts-ignore
                const position = this.projection(d.properties.centroid || [0, 0]);
                return position[1];
            })
            .attr('dy', d => {
                // @ts-ignore
                if (d.properties.name === '澳门') {
                    return 15;
                }
            })
            // @ts-ignore
            .text(d => d.properties.name);

    }

    addPoint() {
        this.svg.selectAll('g')
            .append('circle')
            .attr('transform', d => {
                if (!d.properties.center) {
                    return;
                }
                const coor = this.projection(d.properties.center);
                return 'translate(' + coor[0] + ',' + coor[1] + ')';

            })
            .attr('r', 2)
            .attr('fill', '#e91e63')
            .attr('class', 'location');
    }

    async getProvince(path, name) {
        const data: any = await this.getJson(path);
        const colors = (i) => d3Color.interpolateGnBu(i);
        // console.log(this.svg.select('#新疆维吾尔自治区'))

        if (!data || !data.features) {
            return;
        }
        this.svg.append('g')
            .attr('id', name)
            .selectAll('g')
            // ts-ignore
            .data(data.features)
            .enter()
            .append('g')
            .append('path')
            .attr('d', this.path)
                // 泸州的geo数据有点问题，还待排查
            // @ts-ignore
            .attr('fill', (d, i) => {
                // return '#' + (Math.floor(Math.random() * 0xFFFFFF)).toString(16);
                return colors(i / 40);

                // return colors(i.toString());
            })
            .attr('fill-rule', 'evenodd')

            .attr('id', (d: any, i) => (d.properties || {}).name)
            .attr('stroke', '#ccc')
            .attr('stroke-width', 1)
            .on('mouseover', (d, i) => {
            });
    }

    async getChinaMap() {
        const data: any = await this.getJson(this.chinaJsonFile);
        this.svg.append('g').attr('id', 'china')
            .selectAll('g')
            // ts-ignore
            .data(data.features)
            .enter()
            .append('g')
            .attr('id', (d: any, i) => {
                return (d.properties || {}).name;
                // return d.priority.name;
            })
            .append('path')
            .attr('d', this.path)
            // @ts-ignore
            .attr('fill', (d, i) => {
                // return '#' + (Math.floor(Math.random() * 0xFFFFFF)).toString(16);
                // return colors(i / 40);
                return 'transparent';

                // return colors(i.toString());
            })
            .attr('fill-rule', 'evenodd')

            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .on('mouseover', (d, i) => {
                // console.log(d3.select(this).attr('id'));
            });

    }

    async getAllProvince() {
        const data: any = await this.getJson(this.chinaJsonFile);
        for (const feature of data.features) {
            if (feature.properties && feature.properties.name) {
                await this.getProvince(this.provincePath + feature.properties.name + '.json', feature.properties.name);
            }

        }
    }

    async getJson(path: string) {
        // return await d3.json('/assets/data/china.geo.json');
        return await d3.json(path);
    }


}
